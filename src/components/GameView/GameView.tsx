import { type Game } from "@prisma/client"
import { Cover } from "./Cover"
import { useGameStore, gameStoreActions as actions } from "~/lib/stores/game"
import { shallow } from "zustand/shallow"
import { trpc } from "~/utils/trpc"
import { useCallback } from "react"
import { TimerMarkers } from "./TimerMarkers"
import { Cowboy } from "~/components/Cowboy"
import { Stage } from "@pixi/react"
import { useSpaceBarListener } from "~/utils/keyboard"
import { IdleText } from "./IdleText"
import { ReadyText } from "./ReadyText"
import { AnimatePresence } from "framer-motion"
import useSound from "use-sound"
import { ResultText } from "./ResultText"
import clsx from "clsx"
import { getOtherPlayerFireTime } from "~/utils/duel"
import { gameIsActive } from "~/utils/game"

type Props = {
	game: Game
	userId: string
}

const COOLDOWN_TIME = 1000
const MISS_DELAY = 1000

export function GameView({ game, userId }: Props) {
	const gameId = game.id
	const [playFireSound] = useSound('/sounds/gunshot.mp3')
	const isCovering = useGameStore(state => state.isCovering)
	const playStatus = useGameStore(state => state.playStatus, shallow)

	const missedStates = useGameStore(state => ({
		self: state.missedSelf,
		opponent: state.missedOpponent
	}), shallow)

	const cowboyStates = useGameStore(state => ({
		self: state.cowboySelf,
		opponent: state.cowboyOpponent
	}), shallow)

	const readyMutation = trpc.duel.readyForDuel.useMutation({
		onSuccess: data => {
			if (data) {
				// Both players are ready and the duel can start
				actions.setPlayStatus({ type: 'playing', duel: data })
				actions.setCowboys({ self: 'start', opponent: 'start' })
			} else {
				// The other player is not ready yet
				actions.setPlayStatus({ type: 'ready' })
				actions.setCowboys({ self: 'start' })
			}
		}
	})

	const fireMutation = trpc.duel.fire.useMutation({
		onMutate: () => actions.setCowboys({ self: 'drawing' }),
		onSuccess: (_, { time }) => {
			actions.setCowboys({ self: 'firing' })
			playFireSound()

			// Show the missed bullet if the player fired too early
			const state = useGameStore.getState()
			if (state.playStatus.type !== 'playing') return
			const hasMissed = time - state.playStatus.duel.bang < 0
			if (hasMissed) {
				actions.setMissed({ self: true })
				setTimeout(() => actions.scareCowboy('self'), MISS_DELAY)
			}
		}
	})

	trpc.duel.onStart.useSubscription(
		{ gameId },
		{
			enabled: playStatus.type === 'ready',
			onData: data => {
				actions.setPlayStatus({ type: 'playing', duel: data })
				actions.setCowboys({ self: 'start', opponent: 'start' })
			}
		}
	)

	trpc.duel.onEnd.useSubscription(
		{ gameId },
		{
			onData: data => {
				actions.setPlayStatus({
					type: 'done',
					duel: data.duel,
					result: data.result
				})
				const { result } = data
				if (result.type === 'win') {
					actions.setCowboys({
						self: result.winnerId !== userId ? 'dead' : undefined,
						opponent: result.winnerId === userId ? 'dead' : undefined
					})
				}
			}
		}
	)

	trpc.duel.onFire.useSubscription(
		{ gameId, userId },
		{
			onData: data => {
				actions.setCowboys({ opponent: 'firing' })
				playFireSound()

				const fireTime = getOtherPlayerFireTime({ duel: data, userId })
				if (!fireTime || !gameIsActive()) return
				const hasMissed = fireTime - data.bang < 0
				if (hasMissed) {
					actions.setMissed({ opponent: true })
					setTimeout(() => actions.scareCowboy('opponent'), MISS_DELAY)
				}
			}
		}
	)

	const handleInteraction = useCallback(() => {
		if (playStatus.type === 'idle') {
			readyMutation.mutate({ gameId, userId })
		}

		if (playStatus.type === 'playing') {
			if (fireMutation.status !== 'idle') return
			const time = Date.now()
			fireMutation.mutate({ gameId, userId, time })
		}

		if (playStatus.type === 'done') {
			actions.coverScreen()
			// We want to wait for the cover animation to finish (300ms + 100ms padding)
			setTimeout(() => {
				actions.reset()
				fireMutation.reset()
				readyMutation.reset()
				actions.uncoverScreen()
			}, 400)
		}
	}, [playStatus, gameId, userId, readyMutation, fireMutation])

	useSpaceBarListener(handleInteraction)

	return (
		<>
			<Cover isEnabled={isCovering} />

			<div className='h-full flex flex-col justify-between'>
				<Stage raf={false} width={375} height={256} options={{ backgroundColor: 0xFAFAFA }}>
					<Cowboy
						status={cowboyStates.opponent}
						missedBullet={missedStates.self}
					/>
				</Stage>

				<Stage raf={false} width={375} height={256} options={{ backgroundColor: 0xFAFAFA }}>
					<Cowboy
						status={cowboyStates.self}
						missedBullet={missedStates.opponent}
						flipped
					/>
				</Stage>
			</div>

			{playStatus.type === 'playing' && (
				<TimerMarkers duel={playStatus.duel} />
			)}

			<AnimatePresence>
				{playStatus.type === 'idle' && (
					<IdleText onReady={handleInteraction} />
				)}
			</AnimatePresence>

			<AnimatePresence>
				{playStatus.type === 'ready' && (
					<ReadyText />
				)}
			</AnimatePresence>

			<AnimatePresence>
				{playStatus.type === 'done' && (
					<ResultText
						result={playStatus.result}
						duel={playStatus.duel}
						userId={userId}
						onRematch={handleInteraction}
					/>
				)}
			</AnimatePresence>

			<div
				onClick={handleInteraction}
				className={clsx(
					'w-full h-full absolute',
					playStatus.type === 'playing' ? 'pointer-events-auto' : 'pointer-events-none'
				)}
			/>
		</>
	)
}
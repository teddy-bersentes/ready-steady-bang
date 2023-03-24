import { type Game } from "@prisma/client"
import { Cover } from "./Cover"
import { useGameStore, gameStoreActions as actions } from "~/lib/stores/game"
import { shallow } from "zustand/shallow"
import { trpc } from "~/utils/trpc"
import { useCallback, useEffect } from "react"
import { TimerMarkers } from "./TimerMarkers"
import { Cowboy } from "../Cowboy/Cowboy"
import { Stage } from "@pixi/react"

type Props = {
	game: Game
	userId: string
}

export function GameView({ game, userId }: Props) {
	const gameId = game.id
	const isCovering = useGameStore(state => state.isCovering)
	const playStatus = useGameStore(state => state.playStatus, shallow)
	const cowboyStates = useGameStore(
		state => ({ self: state.cowboySelf, opponent: state.cowboyOpponent }),
		shallow
	)

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
		onSuccess: () => actions.setCowboys({ self: 'firing' })
	})

	trpc.duel.onStart.useSubscription(
		{ gameId },
		{
			onData: data => {
				actions.setPlayStatus({ type: 'playing', duel: data })
				actions.setCowboys({ self: 'start', opponent: 'start' })
			},
			enabled: playStatus.type === 'ready'
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

	const handleInteraction = useCallback(() => {
		if (playStatus.type === 'playing') {
			if (fireMutation.status !== 'idle') return
			const time = Date.now()
			fireMutation.mutate({ gameId, userId, time })
		}

		if (playStatus.type === 'done') {
			// TODO: Go to next game
		}

		if (playStatus.type === 'idle') {
			readyMutation.mutate({ gameId, userId })
		}
	}, [playStatus, gameId, userId, readyMutation, fireMutation])

	const handleKeyDown = useCallback((e: KeyboardEvent) => {
		if (e.code === 'Space') {
			handleInteraction()
		}
	}, [handleInteraction])

	useEffect(() => {
		window.addEventListener('keydown', handleKeyDown)
		return () => window.removeEventListener('keydown', handleKeyDown)
	}, [handleKeyDown])

	return (
		<>
			<Cover isEnabled={isCovering} />

			<div className='h-full flex flex-col justify-between'>
				<Stage
					width={375}
					height={256}
					options={{ backgroundColor: 0xFAFAFA }}
				>
					<Cowboy status={cowboyStates.opponent} flipped />
				</Stage>

				<Stage
					width={375}
					height={256}
					options={{ backgroundColor: 0xFAFAFA }}
				>
					<Cowboy status={cowboyStates.self} />
				</Stage>
			</div>

			{playStatus.type === 'playing' && (
				<TimerMarkers duel={playStatus.duel} />
			)}
		</>
	)
}
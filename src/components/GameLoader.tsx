import { type Game } from '@prisma/client'
import { useRouter } from 'next/router'
import { trpc } from '~/utils/trpc'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { NotFoundPopup } from '~/components/NotFoundPopup'
import { Assets } from '@pixi/assets'
import { Bundle } from '~/utils/assets'
import { AnimatePresence } from 'framer-motion'
import { LoadingText } from '~/components/LoadingText'
import { WaitingText } from '~/components/WaitingText'
import { GameView } from '~/components/GameView/GameView'
import { useSoundLoader } from '~/utils/sounds'

type Props = {
	userId: string
	gameId: string
}

export function GameLoader({ gameId, userId }: Props) {
	const router = useRouter()
	const [notFound, setNotFound] = useState<boolean>(false)
	const [game, setGame] = useState<Game | null>(null)
	const [assetsLoaded, setAssetsLoaded] = useState<boolean>(false)
	const [soundsLoaded, setSoundsLoaded] = useState<boolean>(false)
	const [waitingForPlayers, setWaitingForPlayers] = useState<boolean>(false)

	const joinMutation = trpc.game.joinPrivateGame.useMutation({
		onSuccess: data => setGame(data)
	})

	const gameQuery = trpc.game.findById.useQuery(
		{ gameId },
		{
			enabled: game === null,
			onSuccess: data => {
				console.log('data', data)
				if (data === null) return setNotFound(true)

				if (data.type === 'pending-game') {
					if (data.pendingGame.creatorId !== userId) {
						// The user is joining from a shared link
						return joinMutation.mutateAsync({ gameId, userId })
					} else {
						// The user made the game, so they should wait for someone to join
						return setWaitingForPlayers(true)
					}
				}

				if (data.type === 'game') {
					const isUser1 = data.game.user1Id === userId
					const isUser2 = data.game.user2Id === userId
					if (!isUser1 && !isUser2) return setNotFound(true)
					setGame(data.game) // The user is in the game, so they should be re-join the game
				}
			}
		}
	)


	const isLoading = useMemo(
		() => !assetsLoaded || gameQuery.status === 'loading' || !soundsLoaded,
		[assetsLoaded, gameQuery.status, soundsLoaded]
	)

	trpc.game.onPrivateJoin.useSubscription(
		{ gameId, userId },
		{
			enabled: !isLoading && waitingForPlayers,
			onData: data => {
				setGame(data)
				setWaitingForPlayers(false)
			}
		}
	)

	const loadAssets = useCallback(async () => {
		const startTime = Date.now()
		await Assets.loadBundle(Bundle.GAME_SCREEN)
		const endTime = Date.now()
		if (endTime - startTime < 2000) {
			// We want to show the loading screen for at least 2 seconds to prevent a weird flash
			await new Promise(resolve => setTimeout(resolve, 2000))
		}
		setAssetsLoaded(true)
	}, [])

	useSoundLoader(() => {
		setSoundsLoaded(true)
	})

	useEffect(() => {
		loadAssets()
			.catch(console.error)
	}, [loadAssets])

	return (
		<>
			<AnimatePresence>
				{isLoading && <LoadingText />}
			</AnimatePresence>

			<AnimatePresence>
				{!isLoading && waitingForPlayers && <WaitingText />}
			</AnimatePresence>

			{!isLoading && game && <GameView game={game} userId={userId} />}

			<NotFoundPopup
				isOpen={notFound}
				onNext={() => router.push('/')}
			>
				It seems like this game doesn&apos;t exist. Try creating a new game in the main menu.
			</NotFoundPopup>
		</>
	)
}



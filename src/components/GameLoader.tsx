import { type Game } from '@prisma/client'
import { useRouter } from 'next/router'
import { trpc } from '~/utils/trpc'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { NotFoundPopup } from '~/components/NotFoundPopup'
import { Assets } from '@pixi/assets'
import { Bundle } from '~/lib/bundles'
import { AnimatePresence } from 'framer-motion'
import { LoadingText } from './LoadingText'

type Props = {
	userId: string
	gameId: string
}

export function GameLoader({ gameId, userId }: Props) {
	const router = useRouter()
	const [notFound, setNotFound] = useState<boolean>(false)
	const [game, setGame] = useState<Game | null>(null)
	const [assetsLoaded, setAssetsLoaded] = useState<boolean>(false)

	const gameQuery = trpc.game.findById.useQuery(
		{ gameId },
		{
			enabled: game === null,
			onSuccess: data => {
				if (data === null) return setNotFound(true)

				if (data.type === 'pending-game') {
					if (data.pendingGame.creatorId !== userId) {
						// The user is joining from a shared link
					} else {
						// The user made the game, so they should wait for someone to join
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

	const loadAssets = useCallback(async () => {
		const startTime = Date.now()
		await Assets.loadBundle(Bundle.GAME_SCREEN)
		const endTime = Date.now()
		if (endTime - startTime < 3000) {
			// We want to show the loading screen for at least 3 seconds to prevent a weird flash
			await new Promise(resolve => setTimeout(resolve, 2000))
		}
		setAssetsLoaded(true)
	}, [])

	useEffect(() => {
		loadAssets()
			.catch(console.error)
	}, [loadAssets])

	const isLoading = useMemo(
		() => !assetsLoaded || gameQuery.status === 'loading',
		[assetsLoaded, gameQuery.status]
	)

	return (
		<>
			<AnimatePresence>
				{isLoading && <LoadingText />}
			</AnimatePresence>

			<NotFoundPopup
				isOpen={notFound}
				onNext={() => router.push('/')}
			/>
		</>
	)
}



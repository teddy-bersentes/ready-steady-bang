import { useState, useEffect } from "react";
import { RegisterPopup } from "~/components/RegisterPopup";
import { useRouter } from "next/router";
import { useUserStore } from "~/lib/stores/user";
import { GameLoader } from "~/components/GameLoader";
import { Toaster } from "react-hot-toast"
import { Bundle } from "~/utils/assets";
import { Assets } from "@pixi/assets"

export default function Game() {
	const router = useRouter()
	const gameId = router.query.id as string
	const userId = useUserStore(state => state.userId)
	const [userPopup, setUserPopup] = useState<boolean>(false)

	useEffect(() => {
		setUserPopup(!userId)
	}, [userId])

	useEffect(() => {
		// If the user has no account, it will load in the background for them
		void Assets.backgroundLoadBundle(Bundle.GAME_SCREEN)
	}, [])

	return (
		<div className='relative flex items-center justify-center w-screen h-[100svh] bg-cowboy-gray-50'>
			{userId && gameId && <GameLoader userId={userId} gameId={gameId} />}
			<RegisterPopup
				isOpen={userPopup}
				onClose={() => setUserPopup(false)}
				onSubmit={() => setUserPopup(false)}
			/>

			<Toaster
				position='top-center'
				toastOptions={{
					success: {
						iconTheme: {
							primary: '#7F7F7F',
							secondary: '#FFFFFF'
						}
					},
					duration: 2000
				}}
			/>
		</div>
	)
}
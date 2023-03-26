import { useState } from "react";
import { useRouter } from "next/router";
import { useUserStore } from "~/lib/stores/user";
import { trpc } from "~/utils/trpc";
import { Button } from "~/components/Button";
import { RegisterPopup } from "~/components/RegisterPopup";
import { Stage } from "@pixi/react";
import { MenuAnimation } from "~/components/MenuAnimation";

export default function Index() {
	const router = useRouter()
	const userId = useUserStore(state => state.userId)
	const [userPopup, setUserPopup] = useState<boolean>(false)

	const { mutate: createPrivateGame, status } = trpc.game.createPrivateGame.useMutation({
		onSuccess: data => {
			void router.push(`/game/${data.id}`)
		},
		onError: error => {
			console.error(error)
			alert('Something went wrong :(')
		}
	})

	const checkForUser = async (): Promise<string> => {
		if (userId) return userId
		setUserPopup(true)
		return new Promise(resolve => {
			const unsubscribe = useUserStore.subscribe(state => {
				if (state.userId) {
					unsubscribe()
					resolve(state.userId)
				}
			})
		})
	}

	const onLobby = async () => {
		await checkForUser()
		void router.push('/lobby')
	}

	const onDuel = async () => {
		const userId = await checkForUser()
		if (status !== 'idle') return
		createPrivateGame({ userId })
	}

	return (
		<main className='flex flex-col items-center justify-center w-full h-screen bg-cowboy-gray-50'>
			<h1 className='font-medium tracking-[-2.5%] text-cowboy-gray-800 text-2xl'>
				ready steady bang
			</h1>

			<Stage
				raf={false}
				width={375}
				height={256}
				className='my-8'
				options={{ backgroundColor: 0xFAFAFA }}
			>
				<MenuAnimation />
			</Stage>

			<Button disabled onClick={onLobby} className='mb-4 opacity-60'>
				public lobby
			</Button>

			<Button disabled={status === 'loading'} onClick={onDuel}>
				private duel
			</Button>

			<RegisterPopup
				isOpen={userPopup}
				onClose={() => setUserPopup(false)}
			/>
		</main>
	);
}
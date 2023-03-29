import { createProxySSGHelpers } from "@trpc/react-query/ssg"
import { createTRPCContext } from "~/server/trpc"
import { appRouter } from "~/server/routers/_app"
import type { GetServerSidePropsContext } from "next"
import superjson from "superjson"
import { trpc } from "~/utils/trpc"

import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { useUserStore } from "~/lib/stores/user"
import { RegisterPopup } from "~/components/RegisterPopup"
import { LobbyView } from "~/components/LobbyView"

export default function Lobby() {
	const router = useRouter()
	const lobbyId = router.query.id as string
	const lobbyQuery = trpc.lobby.listUsers.useQuery(
		{ lobbyId },
		{
			select: data => {
				const { userId } = useUserStore.getState()
				return data.filter(user => user.id !== userId)
			}
		}
	)

	const userId = useUserStore(state => state.userId)
	const [userPopup, setUserPopup] = useState<boolean>(false)

	useEffect(() => {
		setUserPopup(!userId)
	}, [userId])

	return (
		<main className='flex flex-col items-center justify-center w-full h-screen bg-cowboy-gray-50'>
			<RegisterPopup
				isOpen={userPopup}
				onClose={() => setUserPopup(false)}
				onSubmit={() => setUserPopup(false)}
			/>

			{lobbyQuery.status === 'success' && userId && (
				<LobbyView
					lobbyId={lobbyId}
					userId={userId}
					users={lobbyQuery.data}
				/>
			)}
		</main>
	)
}

export async function getServerSideProps({ req, res, params }: GetServerSidePropsContext<{ id: string }>) {
	const ssg = createProxySSGHelpers({
		// See `src/pages/lobby/index.tsx` for an explanation of this
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore 
		ctx: createTRPCContext({ req, res }),
		router: appRouter,
		transformer: superjson
	})

	const lobbyId = params?.id as string
	await ssg.lobby.listUsers.prefetch({ lobbyId })

	return {
		props: {
			trpcState: ssg.dehydrate()
		}
	}
}
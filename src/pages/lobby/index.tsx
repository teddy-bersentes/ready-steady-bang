import { createProxySSGHelpers } from "@trpc/react-query/ssg"
import { createTRPCContext } from "~/server/trpc"
import { appRouter } from "~/server/routers/_app"
import type { GetServerSidePropsContext } from "next"
import superjson from "superjson"

import { trpc } from "~/utils/trpc"
import Link from "next/link"


export default function Index() {
	const lobbyQuery = trpc.lobby.list.useQuery()

	return (
		<main className='flex flex-col items-center w-full h-screen bg-cowboy-gray-50 relative'>
			<div className='max-w-[23.4375rem] w-full flex flex-col gap-4 py-4'>
				<h1 className='text-2xl'>Lobbies</h1>
				{lobbyQuery.status === 'success' && (
					<div className='flex flex-col items-center justify-center w-full h-full gap-3'>
						{lobbyQuery.data.map(lobby => (
							<Link href={`/lobby/${lobby.id}`} key={lobby.id} className='w-full justify-between items-center flex bg-cowboy-gray-150 px-3 py-2 rounded-md hover:bg-cowboy-gray-200 transition-colors'>
								<p>{lobby.name}</p>
								<p>{lobby.userCount}/20</p>
							</Link>
						))}
					</div>
				)}
			</div>
		</main>
	)
}

export async function getServerSideProps({ req, res }: GetServerSidePropsContext) {
	// We have to ignore because our context type is weird with the 
	// union of `WebSocket` and `NextResponse`/`NextRequest`
	const ssg = createProxySSGHelpers({
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore 
		ctx: createTRPCContext({ req, res }),
		router: appRouter,
		transformer: superjson
	})

	await ssg.lobby.list.prefetch()

	return {
		props: {
			trpcState: ssg.dehydrate()
		}
	}
}
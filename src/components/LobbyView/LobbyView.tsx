import type { User } from "@prisma/client"
import Image from "next/image";
import { trpc } from "~/utils/trpc";
import { getQueryKey } from "@trpc/react-query";
import { useQueryClient } from "@tanstack/react-query";

type Props = {
	userId: string
	lobbyId: string
	users: User[]
}

export function LobbyView({ userId, lobbyId, users }: Props) {
	const queryClient = useQueryClient()

	trpc.lobby.onUserChange.useSubscription(
		{ lobbyId, userId },
		{
			onData: () => {
				const queryKey = getQueryKey(trpc.lobby.listUsers, { lobbyId })
				void queryClient.invalidateQueries(queryKey)
			}
		}
	)

	return (
		<ul className='flex flex-col justify-center items-center max-w-[23.4375rem] w-full gap-3'>
			<li className='w-full flex flex-row items-center justify-between p-2 bg-cowboy-gray-100 rounded-lg'>
				<div className='flex items-center gap-3'>
					<Image
						src='/images/person_circle.png'
						alt='User avatar'
						className='rounded-full'
						width={32}
						height={32}
					/>
					<p>You</p>
				</div>
			</li>
			{users.map(user => (
				<li key={user.id} className='w-full flex flex-row items-center justify-between p-2 bg-cowboy-gray-100 rounded-lg cursor-pointer group hover:bg-cowboy-gray-150 transition-colors'>
					<div className='flex items-center gap-3'>
						<Image
							src='/images/person_circle.png'
							alt='User avatar'
							className='rounded-full'
							width={32}
							height={32}
						/>
						<p>{user.name}</p>
					</div>
				</li>
			))}
		</ul>
	)
}
import { trpc } from "~/utils/trpc";

export default function Index() {
	const { data, status, error } = trpc.game.count.useQuery()

	return (
		<div className='w-screen h-screen flex justify-center items-center flex-col'>
			<h1>ready steady bang</h1>
			{status === 'loading' && <p className='text-cowboy-gray-400 animate-spin'>loading...</p>}
			{status === 'error' && <p className='text-red-500'>error: {error.message} | {JSON.stringify(error, null, 4)}</p>}
			{status === 'success' && <p className='text-green-500'>count: {data}</p>}
		</div>
	);
}
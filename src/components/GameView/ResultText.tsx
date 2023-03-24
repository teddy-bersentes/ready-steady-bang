import { useMemo } from "react"
import type { Duel } from "~/server/redis"
import type { Result } from "~/server/types/result"
import { Button } from "~/components/Button"

type Props = {
	result: Result
	userId: string
	duel: Duel
	onRematch: () => void
}

export function ResultText({ result, userId, duel, onRematch }: Props) {
	const bang = duel.bang

	const isWinner = useMemo<boolean>(() => {
		return result.type === 'win' && result.winnerId === userId
	}, [result, userId])

	const winnerTime = useMemo<string>(() => {
		if (result.type === 'draw') return '---'
		const time = result.times[result.winnerId]
		if (!time) return '---'
		return (time - bang > 0) ? `${time - bang}ms` : '---'
	}, [result, bang])

	const loserTime = useMemo<string>(() => {
		if (result.type === 'draw') return '---'
		const time = result.times[result.loserId]
		if (!time) return '---'
		return (time - bang > 0) ? `${time - bang}ms` : '---'
	}, [result, bang])

	return (
		<div className='flex flex-col justify-center items-center absolute'>
			<h1 className='text-2xl text-cowboy-gray-600 mb-2'>
				{result.type === 'draw' && <>DRAW</>}
				{result.type === 'win' && result.winnerId === userId && <>YOU WIN</>}
				{result.type === 'win' && result.winnerId !== userId && <>YOU LOSE</>}
			</h1>

			<h2 className='text-lg text-center'>
				Your time: {isWinner ? winnerTime : loserTime}
			</h2>

			<h2 className='text-lg my-2 text-center'>
				Opponent&apos;s time: {isWinner ? loserTime : winnerTime}
			</h2>

			<Button onClick={onRematch}>
				REMATCH
			</Button>
		</div>
	)
}
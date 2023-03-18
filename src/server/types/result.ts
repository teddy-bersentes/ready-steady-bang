type Draw = {
	type: 'draw'
}

type Win = {
	type: 'win'
	winnerId: string
	loserId: string
	times: Record<string, number | null>
}

export type Result = { gameId: string } & (Draw | Win)
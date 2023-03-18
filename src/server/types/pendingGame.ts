export type PendingGame = {
	id: string
	creatorId: string
	status: 'pending' | 'started'
}
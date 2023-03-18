export const keys = {
	lobbyUsers: (input: { lobbyId: string }) => `lobby:${input.lobbyId}:users`,
	pendingGame: (input: { gameId: string }) => `game:pending:${input.gameId}`,
	duel: (input: { gameId: string }) => `duel:${input.gameId}`,
	preDuel: (input: { gameId: string }) => `duel:pre:${input.gameId}`,
	duelStart: (input: { gameId: string }) => `duel:start:${input.gameId}`,
	duelEnd: (input: { gameId: string }) => `duel:end:${input.gameId}`,
	duelFire: (input: { gameId: string, userId: string }) => `duel:fire:${input.gameId}:${input.userId}`,
}
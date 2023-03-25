import type { Duel } from "~/server/redis";

type Params = {
	duel: Duel
	userId: string
}

export const getOtherPlayerFireTime = ({ duel, userId }: Params): number | null => {
	const { user1Id, user2Id } = duel;
	if (user1Id === userId) return duel.user2Fire
	if (user2Id === userId) return duel.user1Fire
	return null
}
import { createTRPCRouter, publicProcedure } from "~/server/trpc";

export const lobbyRouter = createTRPCRouter({
	list: publicProcedure
		.query(async ({ ctx }) => {
			return await ctx.prisma.lobby.findMany({})
		})
});
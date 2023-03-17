import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const gameRouter = createTRPCRouter({
	count: publicProcedure
		.query(async ({ ctx }) => {
			const num = await ctx.prisma.game.count()
			return num
		})
});

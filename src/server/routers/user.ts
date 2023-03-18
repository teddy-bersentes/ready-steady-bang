import { createTRPCRouter, publicProcedure } from "~/server/trpc";
import { nanoid } from "nanoid";
import { z } from "zod";

export const userRouter = createTRPCRouter({
	register: publicProcedure
		.input(
			z.object({
				name: z.string().min(1).max(51)
			})
		)
		.mutation(async ({ input, ctx }) => {
			const user = await ctx.prisma.user.create({
				data: {
					// We use nanoid because uuid's look ugly in the URL.
					// It's also easier to read when debugging for now.
					// Possible combinations: 62^8 = 218340105584896
					id: nanoid(8),
					name: input.name
				}
			})
			return user
		}),

	viewer: publicProcedure
		.input(
			z.object({
				userId: z.string().optional().nullable()
			})
		)
		.query(async ({ input, ctx }) => {
			if (!input.userId) return null
			const user = await ctx.prisma.user.findUnique({
				where: {
					id: input.userId
				}
			})
			return user
		})
})
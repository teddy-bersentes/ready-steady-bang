import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/trpc";
import { observable } from "@trpc/server/observable";
import { keys } from "~/server/redis";

export const lobbyRouter = createTRPCRouter({
	list: publicProcedure
		.query(async ({ ctx }) => {
			return await ctx.prisma.lobby.findMany({})
		}),

	listUsers: publicProcedure
		.input(
			z.object({
				lobbyId: z.string()
			})
		)
		.query(async ({ ctx, input }) => {
			const key = keys.lobbyUsers({ lobbyId: input.lobbyId })
			const userIds = await ctx.redis.sinter(key)
			const users = await ctx.prisma.user.findMany({
				where: {
					id: {
						in: userIds
					}
				}
			})

			return users
		}),

	onUserChange: publicProcedure
		.input(
			z.object({
				lobbyId: z.string(),
				userId: z.string()
			})
		)
		.subscription(async ({ ctx, input }) => {
			type UserChange = { type: 'add' | 'remove', userId: string }

			const key = keys.lobbyUsers({ lobbyId: input.lobbyId })

			await ctx.redis.sadd(key, input.userId)
			await ctx.prisma.lobby.update({
				where: {
					id: input.lobbyId
				},
				data: {
					userCount: {
						increment: 1
					}
				}
			})

			const event: UserChange = { type: 'add', userId: input.userId }
			ctx.redis.emit(key, event)

			return observable<UserChange>(emit => {
				const onChange = (change: UserChange) => {
					if (change.userId === input.userId) return
					emit.next(change)
				}

				ctx.redis.on(key, onChange)
				return async () => {
					ctx.redis.off(key, onChange)
					await ctx.redis.srem(key, input.userId)
					await ctx.prisma.lobby.update({
						where: {
							id: input.lobbyId
						},
						data: {
							userCount: {
								decrement: 1
							}
						}
					})

					const event: UserChange = { type: 'remove', userId: input.userId }
					ctx.redis.emit(key, event)
				}
			})
		})
});
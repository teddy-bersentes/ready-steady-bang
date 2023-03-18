import { z } from "zod";
import { nanoid } from "nanoid";
import { createTRPCRouter, publicProcedure } from "~/server/trpc";
import { type PendingGame } from "~/server/types/pendingGame";
import { background } from "~/server/utils/background";
import { TRPCError } from "@trpc/server";
import { observable } from "@trpc/server/observable";
import { type Game } from "@prisma/client";

export const gameRouter = createTRPCRouter({
	createPrivateGame: publicProcedure
		.input(
			z.object({
				userId: z.string(),
			})
		)
		.mutation(async ({ ctx, input }) => {
			const pendingGame: PendingGame = {
				id: nanoid(8), // See comment in src/server/routers/userRouter.ts
				creatorId: input.userId,
				status: 'pending'
			}
			const key = ctx.keys.pendingGame({ gameId: pendingGame.id })
			const data = ctx.transformer.stringify(pendingGame)
			await ctx.redis.set(key, data)
			return pendingGame
		}),

	joinPrivateGame: publicProcedure
		.input(
			z.object({
				gameId: z.string(),
				userId: z.string()
			})
		)
		.mutation(async ({ ctx, input }) => {
			const key = ctx.keys.pendingGame({ gameId: input.gameId })
			const rawData = await ctx.redis.get(key)
			if (!rawData) throw new TRPCError({ code: 'NOT_FOUND' })

			const pendingGame = ctx.transformer.parse<PendingGame>(rawData)
			if (pendingGame.creatorId === input.userId) throw new TRPCError({ code: 'BAD_REQUEST' })

			// Update the pending game to mark it as started
			pendingGame.status = 'started'

			const game = await ctx.prisma.game.create({
				data: {
					id: pendingGame.id,
					user1Id: pendingGame.creatorId,
					user2Id: input.userId
				}
			})

			background(async () => {
				await ctx.redis.del(key)
			})

			ctx.redis.emit(key, game)
			return game
		}),

	onPrivateJoin: publicProcedure
		.input(
			z.object({
				gameId: z.string(),
				userId: z.string()
			})
		)
		.subscription(({ input, ctx }) => {
			const key = ctx.keys.pendingGame({ gameId: input.gameId })
			return observable<Game>(emit => {
				const onPrivateJoin = (game: Game) => {
					emit.next(game)
				}
				ctx.redis.on(key, onPrivateJoin)
				return () => ctx.redis.off(key, onPrivateJoin)
			})
		}),

	findById: publicProcedure
		.input(
			z.object({
				gameId: z.string()
			})
		)
		.query(async ({ ctx, input }) => {
			const game = await ctx.prisma.game.findUnique({
				where: { id: input.gameId }
			})

			if (game) return {
				type: 'game' as const,
				game
			}

			const key = ctx.keys.pendingGame({ gameId: input.gameId })
			const rawData = await ctx.redis.get(key)
			if (rawData) return {
				type: 'pending-game' as const,
				pendingGame: ctx.transformer.parse<PendingGame>(rawData)
			}

			return null
		})
});

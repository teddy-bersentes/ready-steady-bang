import { createTRPCRouter, publicProcedure } from "~/server/trpc"
import { TRPCError } from "@trpc/server"
import { observable } from "@trpc/server/observable"
import { background } from "~/server/utils/background"
import { delay } from "~/server/utils/delay"
import { duelIO, type Duel, type EndData } from "~/server/redis"
import { z } from "zod"

export const duelRouter = createTRPCRouter({
	readyForDuel: publicProcedure
		.input(
			z.object({
				gameId: z.string(),
				userId: z.string()
			})
		)
		.mutation(async ({ input, ctx }): Promise<Duel | null> => {
			const { gameId } = input

			const preparedDuel = await ctx.duelIO.getPrepared({ gameId })
			if (preparedDuel && preparedDuel !== input.userId) {
				const game = await ctx.prisma.game.findUnique({
					where: { id: gameId }
				})
				if (!game) throw new TRPCError({ code: 'NOT_FOUND', message: 'Game not found' })

				const duel = await ctx.duelIO.create(game)

				ctx.duelIO.emitStart(duel)

				background(async () => {
					await ctx.duelIO.removePrepared({ gameId: duel.gameId })
				})

				return duel
			} else {
				const existingDuel = await ctx.duelIO.get({ gameId })
				if (existingDuel) {
					if (
						existingDuel.status === 'ended' ||
						existingDuel.bang < Date.now()
					) { // if the duel is already over
						await ctx.duelIO.deleteAll({ gameId })
						await ctx.duelIO.prepare(input)
						return null
					} else {
						return existingDuel
					}
				}

				// This can run multiple times, depending on 
				// if the user leaves or refreshes the page.
				await ctx.duelIO.prepare(input)
				return null
			}
		}),

	onStart: publicProcedure
		.input(
			z.object({
				gameId: z.string()
			})
		)
		.subscription(({ input, ctx }) => {
			return observable<Duel>(emit => {
				const unsubscribe = ctx.duelIO.onStart(input, duel => {
					emit.next(duel)
				})
				return unsubscribe
			})
		}),

	getById: publicProcedure
		.input(
			z.object({
				gameId: z.string(),
				userId: z.string()
			})
		)
		.query(async ({ input, ctx }): Promise<Duel | null> => {
			return await ctx.duelIO.get(input)
		}),

	fire: publicProcedure
		.input(
			z.object({
				gameId: z.string(),
				userId: z.string(),
				time: z.number()
			})
		)
		.mutation(async ({ input, ctx }): Promise<void> => {
			const { gameId } = input
			const duel = await ctx.duelIO.fire(input)

			const missed = input.time < duel.bang
			const isFirstShot = duel.user1Fire === null || duel.user2Fire === null
			const isSecondShot = !isFirstShot

			if (isFirstShot && !missed) {
				await ctx.duelIO.updateField({
					gameId,
					field: 'status',
					value: 'finishing'
				})

				background(async () => {
					await delay(250)
					const laterDuel = await ctx.duelIO.get({ gameId })
					if (!laterDuel) throw new Error('Duel not found after delay')
					if (laterDuel.status !== 'finishing') return
					await ctx.duelIO.end(laterDuel)
				})
			}

			if (isSecondShot) {
				background(async () => {
					await ctx.duelIO.end(duel)
				})
			}
		}),

	onFire: publicProcedure
		.input(
			z.object({
				gameId: z.string(),
				userId: z.string()
			})
		)
		.subscription(({ input }) => {
			return observable<Duel>(emit => {
				const unsubscribe = duelIO.onFire(input, duel => {
					emit.next(duel)
				})
				return unsubscribe
			})
		}),

	onEnd: publicProcedure
		.input(
			z.object({
				gameId: z.string()
			})
		)
		.subscription(({ input }) => {
			return observable<EndData>(emit => {
				const unsubscribe = duelIO.onEnd(input, result => {
					emit.next(result)
				})
				return unsubscribe
			})
		})
})
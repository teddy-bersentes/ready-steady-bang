import { z } from "zod";
import { keys, redis } from ".";
import { generateTimes } from "~/server/utils/timers";
import { unixNullableSchema, unixSchema } from "~/server/types/unix"
import type { Game } from "@prisma/client";
import type { Result } from "~/server/types/result";

export const duelSchema = z.object({
	gameId: z.string(),
	user1Id: z.string(),
	user2Id: z.string(),
	user1Fire: unixNullableSchema.default(null),
	user2Fire: unixNullableSchema.default(null),
	start: unixSchema,
	ready: unixSchema,
	steady: unixSchema,
	bang: unixSchema,
	status: z.enum(['in-progress', 'finishing', 'ended'])
})

export type Duel = z.infer<typeof duelSchema>
export type EndData = { result: Result, duel: Duel }

class DuelIO {
	async create(input: Game) {
		const key = keys.duel({ gameId: input.id })
		const times = generateTimes()
		const duel: Duel = {
			gameId: input.id,
			user1Id: input.user1Id,
			user2Id: input.user2Id,
			user1Fire: null,
			user2Fire: null,
			status: 'in-progress',
			...times
		}
		await redis.hmset(key, duel)
		return duel
	}

	async get(input: { gameId: string }): Promise<Duel | null> {
		const { gameId } = input
		const key = keys.duel({ gameId })
		const obj = await redis.hgetall(key)
		// hgetall returns an empty object if the key doesn't exist
		if (
			Object.keys(obj).length === 0 &&
			obj.constructor === Object
		) return null
		const duel = duelSchema.parse(obj)
		return duel
	}

	async deleteAll(input: { gameId: string }) {
		const { gameId } = input
		const duelKey = keys.duel({ gameId })
		const prepareKey = keys.preDuel({ gameId })
		await redis.del([duelKey, prepareKey])
	}

	async updateField<T extends keyof Duel>(input: { gameId: string, field: T, value: Duel[T] }) {
		const { gameId, field, value } = input
		const key = keys.duel({ gameId })
		if (value === null) {
			await redis.hdel(key, field)
			return
		}
		await redis.hset(key, field, value.toString())
	}

	async prepare(input: { gameId: string, userId: string }) {
		const { gameId, userId } = input
		const key = keys.preDuel({ gameId })
		await redis.set(key, userId)
	}

	async getPrepared(input: { gameId: string }): Promise<string | null> {
		const { gameId } = input
		const key = keys.preDuel({ gameId })
		const userId = await redis.get(key)
		return userId
	}

	async removePrepared(input: { gameId: string }) {
		const { gameId } = input
		const key = keys.preDuel({ gameId })
		await redis.del(key)
	}

	emitStart(duel: Duel) {
		const key = keys.duelStart({ gameId: duel.gameId })
		redis.emit(key, duel)
	}

	onStart(input: { gameId: string }, cb: (duel: Duel) => void) {
		const { gameId } = input
		const key = keys.duelStart({ gameId })
		redis.on(key, cb)
		return () => redis.off(key, cb)
	}

	emitFire(input: { userId: string, duel: Duel }) {
		const { userId, duel } = input
		const key = keys.duelFire({ gameId: duel.gameId, userId })
		redis.emit(key, duel)
	}

	onFire(input: { gameId: string; userId: string }, cb: (duel: Duel) => void) {
		const { gameId, userId } = input
		const key = keys.duelFire({ gameId, userId })
		redis.on(key, cb)
		return () => redis.off(key, cb)
	}

	async fire(input: { gameId: string, userId: string, time: number }): Promise<Duel> {
		const { gameId, userId, time } = input
		const duel = await this.get({ gameId })
		if (!duel) throw new Error('Duel not found')

		if (duel.user1Id === userId) {
			await this.updateField({
				gameId,
				field: 'user1Fire',
				value: time
			})
			duel.user1Fire = time
			this.emitFire({ userId: duel.user2Id, duel })
		} else if (duel.user2Id === userId) {
			await this.updateField({
				gameId,
				field: 'user2Fire',
				value: time
			})
			duel.user2Fire = time
			this.emitFire({ userId: duel.user1Id, duel })
		} else throw new Error('User fired, but not in duel')

		return duel
	}

	onEnd(input: { gameId: string }, cb: (result: EndData) => void) {
		const { gameId } = input
		const key = keys.duelEnd({ gameId })
		redis.on(key, cb)
		return () => redis.off(key, cb)
	}

	private emitEnd(input: { result: Result, duel: Duel }) {
		const { gameId } = input.duel
		const key = keys.duelEnd({ gameId })
		redis.emit(key, input)
	}

	async end(input: Duel) {
		const { gameId, user1Fire, user2Fire, bang } = input

		await this.updateField({
			gameId,
			field: 'status',
			value: 'ended'
		})
		input.status = 'ended'

		const user1Before = user1Fire !== null && user1Fire < bang
		const user2Before = user2Fire !== null && user2Fire < bang

		if (user1Before && user2Before) {
			const result: Result = { type: 'draw', gameId }
			this.emitEnd({ result, duel: input })
			return result
		}

		const times = {
			[input.user1Id]: user1Fire,
			[input.user2Id]: user2Fire
		}

		if (user1Before || user2Before) {
			const winnerId = user1Before ? input.user2Id : input.user1Id
			const loserId = user1Before ? input.user1Id : input.user2Id
			const result: Result = {
				type: 'win',
				winnerId,
				loserId,
				gameId,
				times,
			}
			this.emitEnd({ result, duel: input })
			return result
		}

		if (user1Fire && user2Fire) {
			const gap = user1Fire - user2Fire

			if (gap === 0) { // should never happen, but just in case
				const result: Result = { type: 'draw', gameId }
				this.emitEnd({ result, duel: input })
				return result
			}

			const winnerId = gap < 0 ? input.user1Id : input.user2Id
			const loserId = gap < 0 ? input.user2Id : input.user1Id

			const result: Result = {
				type: 'win',
				winnerId,
				loserId,
				gameId,
				times,
			}
			this.emitEnd({ result, duel: input })
			return result
		} else if (user1Fire) {
			const result: Result = {
				type: 'win',
				winnerId: input.user1Id,
				loserId: input.user2Id,
				gameId,
				times
			}
			this.emitEnd({ result, duel: input })
			return result
		} else if (user2Fire) {
			const result: Result = {
				type: 'win',
				winnerId: input.user2Id,
				loserId: input.user1Id,
				gameId,
				times
			}
			this.emitEnd({ result, duel: input })
			return result
		} else throw new Error('Result logic error')
	}
}

export const duelIO = new DuelIO()
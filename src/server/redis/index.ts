import { Redis } from "ioredis";

if (!process.env.REDIS_URL) throw new Error('REDIS_URL is not defined')
export const redis = new Redis(process.env.REDIS_URL);

export * from './keys'
export * from './duel'
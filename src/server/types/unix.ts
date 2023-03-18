import { z } from "zod";

export const unixSchema = z.union([
	z.number(),
	z.string().transform(Number)
])

export const unixNullableSchema = z
	.union([
		z.number(),
		z.string().transform(s => {
			if (['null', 'undefined', ''].includes(s)) return null
			return Number(s)
		}),
	])
	.nullable()

export type Unix = z.infer<typeof unixSchema>
export type UnixNullable = z.infer<typeof unixNullableSchema>

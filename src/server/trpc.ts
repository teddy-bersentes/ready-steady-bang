import { type CreateNextContextOptions } from "@trpc/server/adapters/next";
import { type NodeHTTPCreateContextFnOptions } from '@trpc/server/adapters/node-http';
import { type IncomingMessage } from "http";
import { prisma } from "~/server/db";
import { redis, keys, duelIO } from "~/server/redis";
import type ws from 'ws'
import superjson from "superjson";
import { initTRPC } from "@trpc/server";
import { ZodError } from "zod";

type ContextParams = CreateNextContextOptions | NodeHTTPCreateContextFnOptions<IncomingMessage, ws>;
export const createTRPCContext = (_opts: ContextParams) => {
	return {
		prisma,
		redis,
		keys,
		duelIO,
		transformer: superjson
	};
};

const t = initTRPC.context<typeof createTRPCContext>().create({
	transformer: superjson,
	errorFormatter({ shape, error }) {
		return {
			...shape,
			data: {
				...shape.data,
				zodError:
					error.cause instanceof ZodError ? error.cause.flatten() : null,
			},
		};
	}
});

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;

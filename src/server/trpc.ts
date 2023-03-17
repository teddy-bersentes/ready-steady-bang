import { type CreateNextContextOptions } from "@trpc/server/adapters/next";
import { type NodeHTTPCreateContextFnOptions } from '@trpc/server/adapters/node-http';
import { type IncomingMessage } from "http";
import { prisma } from "~/server/db";
import type ws from 'ws'

type CreateContextOptions = Record<string, never>;

const createInnerTRPCContext = (_opts: CreateContextOptions) => {
	return {
		prisma
	};
};

type ContextParams = CreateNextContextOptions | NodeHTTPCreateContextFnOptions<IncomingMessage, ws>;
export const createTRPCContext = (_opts: ContextParams) => {
	return createInnerTRPCContext({});
};

import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";

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

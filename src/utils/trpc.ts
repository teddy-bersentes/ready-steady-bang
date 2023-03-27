import { type inferRouterInputs, type inferRouterOutputs } from "@trpc/server";
import { loggerLink, type TRPCLink } from "@trpc/client";
import { wsLink, createWSClient } from '@trpc/client/links/wsLink';
import { type AppRouter } from "~/server/routers/_app";
import { createTRPCNext } from "@trpc/next";
import superjson from "superjson";

if (!process.env.NEXT_PUBLIC_WS_URL) throw new Error('NEXT_PUBLIC_WS_URL is not defined')

const client = typeof window !== 'undefined' ?
	createWSClient({ url: process.env.NEXT_PUBLIC_WS_URL }) :
	undefined

export const trpc = createTRPCNext<AppRouter>({
	config() {
		const links: TRPCLink<AppRouter>[] = [
			loggerLink({
				enabled: (opts) =>
					process.env.NODE_ENV === "development" ||
					(opts.direction === "down" && opts.result instanceof Error),
			})
		]

		if (typeof window !== "undefined" && client) {
			links.push(wsLink<AppRouter>({ client }))
		}

		return {
			transformer: superjson,
			links,
		};
	},
	ssr: false
});

export type RouterInputs = inferRouterInputs<AppRouter>;
export type RouterOutputs = inferRouterOutputs<AppRouter>;

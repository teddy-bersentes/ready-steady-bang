import { type inferRouterInputs, type inferRouterOutputs } from "@trpc/server";
import { httpBatchLink, loggerLink, type TRPCLink } from "@trpc/client";
import { wsLink, createWSClient } from '@trpc/client/links/wsLink';
import { type AppRouter } from "~/server/routers/_app";
import { createTRPCNext } from "@trpc/next";
import superjson from "superjson";


const getBaseUrl = () => {
	if (typeof window !== "undefined") return ""; // browser should use relative url
	if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url
	return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
};

const wsClient = typeof window !== 'undefined' ? createWSClient({
	url: process.env.WS_URL ?? `ws://localhost:3001`,
}) : undefined

export const trpc = createTRPCNext<AppRouter>({
	config() {
		const links: TRPCLink<AppRouter>[] = [
			loggerLink({
				enabled: (opts) =>
					process.env.NODE_ENV === "development" ||
					(opts.direction === "down" && opts.result instanceof Error),
			}),
			httpBatchLink({
				url: `${getBaseUrl()}/api/trpc`,
			})
		]

		if (typeof window !== "undefined" && wsClient) {
			links.push(wsLink<AppRouter>({ client: wsClient }))
		}


		return {
			transformer: superjson,
			links: links,
		};
	},
	ssr: false
});

export type RouterInputs = inferRouterInputs<AppRouter>;
export type RouterOutputs = inferRouterOutputs<AppRouter>;

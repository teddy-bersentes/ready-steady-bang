import { createTRPCRouter } from "~/server/trpc";
import { gameRouter } from "~/server/routers/game";

export const appRouter = createTRPCRouter({
	game: gameRouter
});

export type AppRouter = typeof appRouter;

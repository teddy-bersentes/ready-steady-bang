import { createTRPCRouter } from "~/server/api/trpc";
import { gameRouter } from "~/server/api/routers/game";

export const appRouter = createTRPCRouter({
	game: gameRouter
});

export type AppRouter = typeof appRouter;

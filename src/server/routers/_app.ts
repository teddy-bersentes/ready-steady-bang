import { createTRPCRouter } from "~/server/trpc";
import { gameRouter } from "~/server/routers/game";
import { userRouter } from "~/server/routers/user";
import { lobbyRouter } from "~/server/routers/lobby";

export const appRouter = createTRPCRouter({
	game: gameRouter,
	user: userRouter,
	lobby: lobbyRouter,
});

export type AppRouter = typeof appRouter;
import { createTRPCRouter } from "~/server/trpc";
import { gameRouter } from "~/server/routers/game";
import { userRouter } from "~/server/routers/user";
import { lobbyRouter } from "~/server/routers/lobby";
import { duelRouter } from "~/server/routers/duel";

export const appRouter = createTRPCRouter({
	game: gameRouter,
	user: userRouter,
	lobby: lobbyRouter,
	duel: duelRouter
});

export type AppRouter = typeof appRouter;
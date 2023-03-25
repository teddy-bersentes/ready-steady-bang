import { useGameStore } from "~/lib/stores/game";

export const gameIsActive = (): boolean => useGameStore.getState().playStatus.type === "playing"
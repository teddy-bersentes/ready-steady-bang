import { create } from "zustand";
import type { Duel } from "~/server/redis";
import type { Result } from "~/server/types/result";

/*
 * idle: initial state, not waiting for the duel, but can press `ready`
 * ready: waiting for the duel to start
 * playing: dueling with another player (ready... steady... bang!)
 * done: duel has ended, can press `ready` again
*/
type PlayStatus =
	{ type: 'idle' } |
	{ type: 'ready' } |
	{ type: 'playing', duel: Duel } |
	{ type: 'done', duel: Duel, result: Result }


/*
 * start: The cowboy pops up from the ground
 * drawing: The cowboy's had is approaching the gun
 * firing: The cowboy is shooting the gun
 * dead: The cowboy is dead
 * afraid: The cowboy missed and is afraid
 * null: The cowboy is not visible on the screen
*/
export type CowboyStatus =
	'start' |
	'drawing' |
	'firing' |
	'dead' |
	'afraid' |
	null

type State = {
	playStatus: PlayStatus,
	isCovering: boolean,
	cowboySelf: CowboyStatus,
	cowboyOpponent: CowboyStatus,
	missedSelf: boolean,
	missedOpponent: boolean
}

export const useGameStore = create<State>()(
	(_set) => ({
		playStatus: { type: 'idle' },
		isCovering: false,
		cowboySelf: null,
		cowboyOpponent: null,
		missedSelf: false,
		missedOpponent: false
	})
)

// We don't use the set function passed through zustand's create function,
// for the added convenience of not needing a hook to call an action
export const gameStoreActions = {
	setPlayStatus: (playStatus: PlayStatus) => useGameStore.setState({ playStatus }),
	setCowboys: (input: { self?: CowboyStatus, opponent?: CowboyStatus }) => useGameStore.setState({
		cowboySelf: input.self !== undefined
			? input.self :
			useGameStore.getState().cowboySelf,
		cowboyOpponent: input.opponent !== undefined
			? input.opponent :
			useGameStore.getState().cowboyOpponent
	}),

	coverScreen: () => useGameStore.setState({ isCovering: true }),
	uncoverScreen: () => useGameStore.setState({ isCovering: false }),

	setMissed: (input: { self?: boolean, opponent?: boolean }) => useGameStore.setState({
		missedSelf: input.self !== undefined
			? input.self :
			useGameStore.getState().missedSelf,
		missedOpponent: input.opponent !== undefined
			? input.opponent :
			useGameStore.getState().missedOpponent
	}),

	scareCowboy: (input: 'self' | 'opponent') => {
		const state = useGameStore.getState()
		if (state.playStatus.type !== 'playing') return
		useGameStore.setState({
			[input === 'self' ? 'cowboySelf' : 'cowboyOpponent']: 'afraid',
		})
	},

	reset: () => useGameStore.setState({
		isCovering: false,
		playStatus: { type: 'idle' },
		cowboySelf: null,
		cowboyOpponent: null,
		missedSelf: false,
		missedOpponent: false
	})
}
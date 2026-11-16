import { createListenerMiddleware } from "@reduxjs/toolkit"

import type { RootState } from "."
import { incrementLevelsCompletedCount } from "./progressSlice"
import { processMoveAction, selectPuzzleIsSolved } from "./puzzleSlice"

export const listenerMiddleware = createListenerMiddleware()

listenerMiddleware.startListening({
	predicate: (action, currentState, previousState) =>
		processMoveAction.match(action) &&
		selectPuzzleIsSolved(previousState as RootState) === false &&
		selectPuzzleIsSolved(currentState as RootState) === true,
	effect: (_, listenerApi) => {
		listenerApi.dispatch(incrementLevelsCompletedCount())
	},
})

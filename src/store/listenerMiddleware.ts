import { createListenerMiddleware } from "@reduxjs/toolkit"

import type { RootState } from "."
import { upgradeLevelselectsCompletedCount } from "./progressSlice"
import { selectPuzzleIsSolved } from "./puzzleSlice"

export const listenerMiddleware = createListenerMiddleware()

listenerMiddleware.startListening({
	predicate: (_, currentState, previousState) =>
		selectPuzzleIsSolved(previousState as RootState) === false &&
		selectPuzzleIsSolved(currentState as RootState) === true,
	effect: (_, listenerApi) => {
		listenerApi.dispatch(upgradeLevelselectsCompletedCount())
	},
})

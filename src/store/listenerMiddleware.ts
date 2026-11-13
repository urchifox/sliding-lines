import { createListenerMiddleware } from "@reduxjs/toolkit"

import type { RootState } from "."
import { upgradeLevel } from "./progressSlice"
import { selectPuzzleIsSolved } from "./selectors"

export const listenerMiddleware = createListenerMiddleware()

listenerMiddleware.startListening({
	predicate: (_, currentState, previousState) =>
		selectPuzzleIsSolved(previousState as RootState) === false &&
		selectPuzzleIsSolved(currentState as RootState) === true,
	effect: (_, listenerApi) => {
		listenerApi.dispatch(upgradeLevel())
	},
})

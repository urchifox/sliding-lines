import { createListenerMiddleware } from "@reduxjs/toolkit"

import { store } from "."
import { isPuzzleSolved } from "../puzzle/domain/game"
import { upgradeLevel } from "./progressSlice"
import { markPuzzleAsSolvedAction, processMoveAction } from "./puzzleSlice"
import { selectPuzzleTiles } from "./selectors"

export const listenerMiddleware = createListenerMiddleware()

listenerMiddleware.startListening({
	actionCreator: processMoveAction,
	effect: () => {
		const tiles = selectPuzzleTiles()

		if (tiles !== undefined && isPuzzleSolved(tiles)) {
			store.dispatch(markPuzzleAsSolvedAction())
			store.dispatch(upgradeLevel())
		}
	},
})

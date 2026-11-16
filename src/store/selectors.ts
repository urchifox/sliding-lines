import { store } from "."

export function selectLevelsCompletedCount(state = store.getState()) {
	return state.progress.levelsCompletedCount
}

export function selectPuzzleIsSolved(state = store.getState()) {
	return state.puzzle?.isSolved
}

export function selectPuzzleTiles(state = store.getState()) {
	return state.puzzle?.level.tiles
}

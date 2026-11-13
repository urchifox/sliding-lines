import { store } from "."

export function selectLevelNumber(state = store.getState()) {
	return state.progress.levelNumber
}

export function selectPuzzleIsSolved(state = store.getState()) {
	return state.puzzle?.isSolved
}

export function selectPuzzleTiles(state = store.getState()) {
	return state.puzzle?.level.tiles
}

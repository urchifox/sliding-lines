import { store } from "."

export function selectLevelNumber(state = store.getState()) {
	return state.progress.levelNumber
}

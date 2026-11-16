// @vitest-environment happy-dom
import { REHYDRATE } from "redux-persist"

import { persistor, store } from "."
import { createTestPuzzleData } from "../test/testHelpers"
import {
	resetProgress,
	selectLevelsCompletedCount,
	upgradeLevelselectsCompletedCount,
} from "./progressSlice"
import {
	resetPuzzleDataAction,
	selectPuzzleIsSolved,
	selectPuzzleTiles,
	setPuzzleDataAction,
} from "./puzzleSlice"

async function waitUntilBootstrapped() {
	if (persistor.getState().bootstrapped) {
		return
	}

	await new Promise<void>((resolve) => {
		const unsubscribe = persistor.subscribe(() => {
			if (persistor.getState().bootstrapped) {
				unsubscribe()
				resolve()
			}
		})
	})
}

describe("store", () => {
	it("saves progress and puzzle data and restores them", async () => {
		await waitUntilBootstrapped()
		const puzzleData = createTestPuzzleData({ levelNumber: 2 })
		store.dispatch(setPuzzleDataAction(puzzleData))
		store.dispatch(upgradeLevelselectsCompletedCount())
		await persistor.flush()

		store.dispatch(resetPuzzleDataAction())
		store.dispatch(resetProgress())
		expect(store.getState().puzzle).toBeNull()
		expect(selectLevelsCompletedCount(store.getState())).toBe(0)

		const saved = localStorage.getItem("persist:root")
		expect(saved).toEqual(expect.any(String))
		const stored = JSON.parse(saved as string) as {
			puzzle: string
			progress: string
		}
		store.dispatch({
			type: REHYDRATE,
			key: "root",
			payload: {
				puzzle: JSON.parse(stored.puzzle),
				progress: JSON.parse(stored.progress),
			},
		})

		expect(selectLevelsCompletedCount(store.getState())).toBe(1)
		expect(selectPuzzleIsSolved(store.getState())).toBe(false)
		expect(selectPuzzleTiles(store.getState())).toEqual(puzzleData.level.tiles)
		expect(store.getState().puzzle?.levelNumber).toBe(2)
	})
})

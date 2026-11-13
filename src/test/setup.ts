import * as matchers from "@testing-library/jest-dom/matchers"
import { createSerializer } from "@emotion/jest"
import "@testing-library/jest-dom/vitest"
import { cleanup } from "@testing-library/react"

import { store } from "../store"
import { resetProgress } from "../store/progressSlice"
import { resetPuzzleDataAction } from "../store/puzzleSlice"

expect.extend(matchers)

expect.addSnapshotSerializer(createSerializer({ includeStyles: false }))

afterEach(() => {
	if (typeof document === "undefined") {
		return
	}

	store.dispatch(resetPuzzleDataAction())
	store.dispatch(resetProgress())

	cleanup()
	localStorage.clear()
})

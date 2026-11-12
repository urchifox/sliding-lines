// @vitest-environment happy-dom
import { fireEvent, screen } from "@testing-library/react"
import { act } from "react"

import { App } from "./App"
import { loadingText } from "./pages/PuzzlePageHelpers"
import { playButtonText } from "./pages/StartPageHelpers"
import { createPuzzleData } from "./puzzle/domain/puzzleData"
import { renderWithStore } from "./test/testHelpers"

vi.mock("./puzzle/domain/puzzleData", () => ({
	createPuzzleData: vi.fn(),
}))

function renderAppWithStore({ isStrictMode }: { isStrictMode?: boolean } = {}) {
	return renderWithStore({ ui: <App />, isStrictMode })
}

describe("App", () => {
	afterEach(() => {
		vi.useRealTimers()
	})

	it("navigates from the start page to the puzzle page", () => {
		vi.useFakeTimers()
		vi.mocked(createPuzzleData).mockReturnValue(new Promise(() => {}))
		renderAppWithStore()

		fireEvent.click(screen.getByRole("button", { name: playButtonText }))
		act(() => {
			vi.advanceTimersByTime(1000)
		})

		expect(screen.getByText(loadingText)).toBeInTheDocument()
		expect(createPuzzleData).toHaveBeenCalledOnce()
	})
})

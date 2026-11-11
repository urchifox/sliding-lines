// @vitest-environment happy-dom
import { fireEvent, render, screen } from "@testing-library/react"
import { act } from "react"

import { App } from "./App"
import { loadingText } from "./pages/PuzzlePageHelpers"
import { playButtonText } from "./pages/StartPageHelpers"
import { createPuzzleData } from "./puzzle/domain/puzzleData"

vi.mock("./puzzle/domain/puzzleData", () => ({
	createPuzzleData: vi.fn(),
}))

describe("App", () => {
	afterEach(() => {
		vi.useRealTimers()
	})

	it("navigates from the start page to the puzzle page", () => {
		vi.useFakeTimers()
		vi.mocked(createPuzzleData).mockReturnValue(new Promise(() => {}))
		render(<App />)

		fireEvent.click(screen.getByRole("button", { name: playButtonText }))
		act(() => {
			vi.advanceTimersByTime(1000)
		})

		expect(screen.getByText(loadingText)).toBeInTheDocument()
		expect(createPuzzleData).toHaveBeenCalledOnce()
	})
})

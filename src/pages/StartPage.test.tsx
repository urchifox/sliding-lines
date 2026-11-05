// @vitest-environment happy-dom
import { fireEvent, render, screen } from "@testing-library/react"
import { act } from "react"

import { AppRoute } from "../AppRoute"
import { StartPage } from "./StartPage"
import { playButtonText } from "./StartPageHelpers"

function getPlayButton() {
	return screen.getByRole("button", { name: playButtonText })
}

function renderPage() {
	const setPage = vi.fn()
	const renderResult = render(<StartPage setPage={setPage} />)
	return { renderResult, setPage }
}

describe("StartPage", () => {
	afterEach(() => {
		vi.useRealTimers()
	})

	it("renders correctly", () => {
		const random = vi.spyOn(Math, "random")
		for (const value of Array.from(
			{ length: 100 },
			(_, index) => index / 100
		)) {
			random.mockReturnValueOnce(value)
		}

		const { renderResult } = renderPage()

		expect(renderResult.container).toMatchSnapshot()
	})

	it("starts the game when the play button is clicked", async () => {
		vi.useFakeTimers()
		const { setPage } = renderPage()

		const playButton = getPlayButton()
		fireEvent.click(playButton)

		expect(setPage).not.toHaveBeenCalled()

		await act(() => vi.advanceTimersByTimeAsync(1000))

		expect(setPage).toHaveBeenCalledOnce()
		expect(setPage).toHaveBeenCalledWith(AppRoute.Game)
	})

	it("ignores repeated clicks on play button", async () => {
		vi.useFakeTimers()
		const { setPage } = renderPage()

		const playButton = getPlayButton()
		fireEvent.click(playButton)
		fireEvent.click(playButton)

		await act(() => vi.advanceTimersByTimeAsync(1000))

		expect(setPage).toHaveBeenCalledOnce()
	})

	it("disables play button after click immediately", () => {
		vi.useFakeTimers()
		renderPage()

		const playButton = getPlayButton()
		fireEvent.click(playButton)
		expect(playButton).toBeDisabled()
	})
})

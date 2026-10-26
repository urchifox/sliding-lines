// @vitest-environment happy-dom
import { createSerializer } from "@emotion/jest"
import { fireEvent, render } from "@testing-library/react"
import { act } from "react"

import { AppRoute } from "../AppRoute"
import { StartPage } from "./StartPage"

expect.addSnapshotSerializer(createSerializer({ includeStyles: false }))

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
		const setPage = vi.fn()

		const renderResult = render(<StartPage setPage={setPage} />)

		expect(renderResult.container).toMatchSnapshot()
	})

	it("starts the game when the play button is clicked", async () => {
		vi.useFakeTimers()
		const setPage = vi.fn()
		const renderResult = render(<StartPage setPage={setPage} />)

		const playButton = renderResult.getByRole("button", { name: "Play" })
		fireEvent.click(playButton)

		expect(setPage).not.toHaveBeenCalled()

		await act(() => vi.advanceTimersByTimeAsync(1000))

		expect(setPage).toHaveBeenCalledOnce()
		expect(setPage).toHaveBeenCalledWith(AppRoute.Game)
	})

	it("ignores repeated clicks on play button", async () => {
		vi.useFakeTimers()
		const setPage = vi.fn()
		const renderResult = render(<StartPage setPage={setPage} />)

		const playButton = renderResult.getByRole("button", { name: "Play" })
		fireEvent.click(playButton)
		fireEvent.click(playButton)

		await act(() => vi.advanceTimersByTimeAsync(1000))

		expect(setPage).toHaveBeenCalledOnce()
	})

	it("disables play button after click immediately", () => {
		vi.useFakeTimers()
		const setPage = vi.fn()
		const renderResult = render(<StartPage setPage={setPage} />)

		const playButton = renderResult.getByRole("button", { name: "Play" })
		fireEvent.click(playButton)
		expect(playButton).toBeDisabled()
	})
})

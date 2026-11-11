// @vitest-environment happy-dom
import { fireEvent, render } from "@testing-library/react"

import { createTile } from "../../test/testHelpers"
import type { PuzzleTileInfo } from "../domain/types"
import { PuzzleTile } from "./PuzzleTile"
import { getTileButtonText, getTileLabel, tileLabelMatcher } from "./helpers"

function renderPuzzleTile(props?: {
	tile?: PuzzleTileInfo
	isFinished?: boolean
}) {
	const {
		tile = createTile({ originalRow: 1, originalColumn: 1 }),
		isFinished = false,
	} = props ?? {}
	const handleClick = vi.fn()

	const renderResult = render(
		<PuzzleTile
			handleClick={handleClick}
			tile={tile}
			isFinished={isFinished}
			tabIndex={0}
		/>
	)
	return { renderResult, handleClick, tile }
}

describe("PuzzleTile", () => {
	it("renders correctly", () => {
		const { renderResult } = renderPuzzleTile()

		expect(renderResult.container).toMatchSnapshot()
	})

	it("has correct label on li and button text", () => {
		const { renderResult, tile } = renderPuzzleTile()

		const element = renderResult.container.firstChild as HTMLElement
		const ariaLabel = element.getAttribute("aria-label")
		expect(ariaLabel).toBe(getTileLabel(tile.key))
		expect(ariaLabel).toMatch(tileLabelMatcher)
		const button = renderResult.getByRole("button")
		const buttonText = button.textContent
		expect(buttonText).toBe(getTileButtonText(tile))
	})

	it("sets click listener", () => {
		const { renderResult, handleClick } = renderPuzzleTile()

		const button = renderResult.getByRole("button")
		fireEvent.click(button)

		expect(handleClick).toHaveBeenCalledOnce()
	})

	it("does nothing when an empty tile is clicked", () => {
		const tile = createTile({
			originalRow: 1,
			originalColumn: 1,
			isEmpty: true,
		})
		const { renderResult, handleClick } = renderPuzzleTile({ tile })
		const button = renderResult.getByRole("button") as HTMLButtonElement

		expect(button).toBeDisabled()
		button.disabled = false
		fireEvent.click(button)

		expect(handleClick).not.toHaveBeenCalled()
	})

	it("does nothing when a tile is clicked and the puzzle is finished", () => {
		const { renderResult, handleClick } = renderPuzzleTile({
			isFinished: true,
		})
		const button = renderResult.getByRole("button") as HTMLButtonElement

		expect(button).toBeDisabled()
		button.disabled = false
		fireEvent.click(button)

		expect(handleClick).not.toHaveBeenCalled()
	})
})

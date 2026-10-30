// @vitest-environment happy-dom
import { createSerializer } from "@emotion/jest"
import { fireEvent, render } from "@testing-library/react"

import {
	createTile,
	getTileLabel,
	tileLabelMatcher,
} from "../../test/testHelpers"
import { PuzzleTile } from "./PuzzleTile"

function getPuzzleTileData() {
	const tile = createTile({ originalRow: 1, originalColumn: 1 })
	const handleClick = vi.fn()
	const puzzleRef = {
		current: {
			"1-1": null,
		},
	}

	return {
		tile,
		handleClick,
		puzzleRef,
	}
}

expect.addSnapshotSerializer(createSerializer({ includeStyles: false }))

describe("PuzzleTile", () => {
	it("renders correctly", () => {
		const { tile, handleClick, puzzleRef } = getPuzzleTileData()

		const renderResult = render(
			<PuzzleTile
				tile={tile}
				handleClick={handleClick}
				puzzleRef={puzzleRef}
				isFinished={false}
			/>
		)

		expect(renderResult.container).toMatchSnapshot()
	})

	it("has correct label", () => {
		const { tile, handleClick, puzzleRef } = getPuzzleTileData()

		const renderResult = render(
			<PuzzleTile
				tile={tile}
				handleClick={handleClick}
				puzzleRef={puzzleRef}
				isFinished={false}
			/>
		)

		const element = renderResult.container.firstChild as HTMLElement
		const ariaLabel = element.getAttribute("aria-label")
		expect(ariaLabel).toBe(getTileLabel(tile.key))
		expect(ariaLabel).toMatch(tileLabelMatcher)
	})

	it("sets click listener", () => {
		const { tile, handleClick, puzzleRef } = getPuzzleTileData()

		const renderResult = render(
			<PuzzleTile
				tile={tile}
				handleClick={handleClick}
				puzzleRef={puzzleRef}
				isFinished={false}
			/>
		)

		const button = renderResult.getByRole("button")
		fireEvent.click(button)

		expect(handleClick).toHaveBeenCalledOnce()
	})
})

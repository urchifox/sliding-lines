// @vitest-environment happy-dom
import { fireEvent, render } from "@testing-library/react"

import {
	createAlmostSolvedTiles,
	expectTileBeingMovedAt,
	expectTileNotBeingMoved,
	getAllTilesElements,
	getTileButton,
	getTileElement,
} from "../../test/testHelpers"
import type { BoardState, Level, PuzzleTileInfo } from "../domain/types"
import { Puzzle } from "./Puzzle"

function getPuzzleData() {
	const level = {
		rows: 3,
		columns: 3,
		shuffleSteps: 2,
		tiles: createAlmostSolvedTiles(),
	} satisfies Level

	const emptySlot = level.tiles.find((tile) => tile.isEmpty) as PuzzleTileInfo

	const imageInfo = {
		imageUrl: "https://example.com/image.jpg",
		width: 100,
		height: 100,
		ratio: 1,
	}

	const onCompleteLevel = vi.fn()

	return {
		level,
		imageInfo,
		onCompleteLevel,
		emptySlot,
	}
}

function renderPuzzle(boardState: BoardState) {
	const puzzleData = getPuzzleData()
	const renderResult = render(
		<Puzzle
			imageInfo={puzzleData.imageInfo}
			onCompleteLevel={puzzleData.onCompleteLevel}
			boardState={boardState}
			level={puzzleData.level}
		/>
	)
	return { renderResult, ...puzzleData }
}

describe("Puzzle", () => {
	it.each([
		{ isFinished: false, isUpdating: false } as const,
		{ isFinished: true, isUpdating: true } as const,
	])(
		"renders correctly with states isFinished: $isFinished, isUpdating: $isUpdating",
		(boardState) => {
			const { renderResult } = renderPuzzle(boardState)

			expect(renderResult.container).toMatchSnapshot()
		}
	)

	it.each([{ tileIndex: 1 }, { tileIndex: 3 }])(
		"swaps tile with empty slot",
		({ tileIndex }) => {
			const { level, emptySlot } = renderPuzzle({
				isFinished: false,
				isUpdating: false,
			})
			const tile = level.tiles[tileIndex]
			const tileInitialPosition = structuredClone(tile.currentPosition)
			const emptySlotInitialPosition = structuredClone(
				emptySlot.currentPosition
			)

			const tileElement = getTileElement(tile.key)
			const tileButton = getTileButton(tile)
			const emptySlotElement = getTileElement(emptySlot.key)
			fireEvent.click(tileButton)

			expectTileBeingMovedAt({
				element: tileElement,
				...emptySlotInitialPosition,
			})
			expectTileBeingMovedAt({
				element: emptySlotElement,
				...tileInitialPosition,
			})
		}
	)

	it("ignores clicks on empty slot", () => {
		const { level, onCompleteLevel, emptySlot } = renderPuzzle({
			isFinished: false,
			isUpdating: false,
		})
		const emptySlotButton = getTileButton(emptySlot)
		const tilesElements = getAllTilesElements()

		fireEvent.click(emptySlotButton)

		expect(tilesElements.length).toBe(level.tiles.length)
		for (const tileElement of tilesElements) {
			expectTileNotBeingMoved(tileElement)
		}
		expect(onCompleteLevel).not.toHaveBeenCalled()
	})

	it.each([
		{ tileIndex: 2 },
		{ tileIndex: 4 },
		{ tileIndex: 6 },
		{ tileIndex: 8 },
	])(
		"ignores clicks on tiles without empty slot as neighbour",
		({ tileIndex }) => {
			const { level, onCompleteLevel } = renderPuzzle({
				isFinished: false,
				isUpdating: false,
			})
			const tile = level.tiles[tileIndex]
			const tilesElements = getAllTilesElements()
			const tileButton = getTileButton(tile)

			fireEvent.click(tileButton)

			expect(tilesElements.length).toBe(level.tiles.length)
			for (const tileElement of tilesElements) {
				expectTileNotBeingMoved(tileElement)
			}
			expect(onCompleteLevel).not.toHaveBeenCalled()
		}
	)

	it.each([{ tileIndex: 1 }, { tileIndex: 3 }])(
		"ignores clicks on tiles when isFinished is true",
		({ tileIndex }) => {
			const { level, onCompleteLevel } = renderPuzzle({
				isFinished: true,
				isUpdating: false,
			})
			const tile = level.tiles[tileIndex]
			const tilesElements = getAllTilesElements()
			const tileButton = getTileButton(tile)

			fireEvent.click(tileButton)

			expect(tilesElements.length).toBe(level.tiles.length)
			for (const tileElement of tilesElements) {
				expectTileNotBeingMoved(tileElement)
			}
			expect(onCompleteLevel).not.toHaveBeenCalled()
		}
	)

	it.each([{ tileIndex: 1 }, { tileIndex: 3 }])(
		"ignores clicks on tiles when isUpdating is true",
		({ tileIndex }) => {
			const { level, onCompleteLevel } = renderPuzzle({
				isFinished: true,
				isUpdating: true,
			})
			const tile = level.tiles[tileIndex]
			const tilesElements = getAllTilesElements()
			const tileButton = getTileButton(tile)

			fireEvent.click(tileButton)

			expect(tilesElements.length).toBe(level.tiles.length)
			for (const tileElement of tilesElements) {
				expectTileNotBeingMoved(tileElement)
			}
			expect(onCompleteLevel).not.toHaveBeenCalled()
		}
	)

	it("calls onCompleteLevel when all tiles are in the correct position", () => {
		const { level, onCompleteLevel, emptySlot } = renderPuzzle({
			isFinished: false,
			isUpdating: false,
		})
		const tile1 = level.tiles[1]
		const tile2 = level.tiles[2]
		const tile1Element = getTileElement(tile1.key)
		const tile1Button = getTileButton(tile1)
		const tile2Element = getTileElement(tile2.key)
		const tile2Button = getTileButton(tile2)
		const emptySlotElement = getTileElement(emptySlot.key)
		const tilesElements = getAllTilesElements()

		fireEvent.click(tile1Button)
		expect(onCompleteLevel).not.toHaveBeenCalled()

		fireEvent.click(tile2Button)
		expect(onCompleteLevel).toHaveBeenCalledOnce()

		expectTileBeingMovedAt({
			element: emptySlotElement,
			...emptySlot.originalPosition,
		})
		expectTileBeingMovedAt({
			element: tile1Element,
			...tile1.originalPosition,
		})
		expectTileBeingMovedAt({
			element: tile2Element,
			...tile2.originalPosition,
		})

		for (const tileElement of tilesElements) {
			if (
				tileElement === tile1Element ||
				tileElement === tile2Element ||
				tileElement === emptySlotElement
			) {
				continue
			}
			expectTileNotBeingMoved(tileElement)
		}
	})
})

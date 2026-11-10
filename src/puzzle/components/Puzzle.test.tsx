// @vitest-environment happy-dom
import { fireEvent, render } from "@testing-library/react"

import {
	createAlmostSolvedTiles,
	expectTilePlacedAtPosition,
	getTileButton,
	getTileElement,
} from "../../test/testHelpers"
import { tryMove } from "../domain/game"
import { getEmptyTile, getTileByKey } from "../domain/tiles"
import type {
	BoardState,
	PuzzleTileInfo,
	PuzzleTilesArray,
} from "../domain/types"
import { Puzzle } from "./Puzzle"

const columns = 3
const rows = 3

const imageInfo = {
	imageUrl: "https://example.com/image.jpg",
	width: 100,
	height: 100,
	ratio: 1,
}

function renderPuzzle(
	boardState: BoardState,
	tiles: PuzzleTilesArray = createAlmostSolvedTiles()
) {
	const handleTryMove = vi.fn()
	const renderResult = render(
		<Puzzle
			imageInfo={imageInfo}
			boardState={boardState}
			handleTryMove={handleTryMove}
			tiles={tiles}
			columns={columns}
			rows={rows}
		/>
	)

	return { renderResult, handleTryMove, tiles }
}

function expectTilesUnmoved(tiles: PuzzleTilesArray) {
	for (const tile of tiles) {
		expectTilePlacedAtPosition({
			element: getTileElement(tile.key),
			tileInfo: tile,
		})
	}
}

function renderBoard(
	renderResult: ReturnType<typeof render>,
	boardState: BoardState,
	tiles: PuzzleTilesArray,
	handleTryMove: (tile: PuzzleTileInfo) => void
) {
	renderResult.rerender(
		<Puzzle
			imageInfo={imageInfo}
			boardState={boardState}
			handleTryMove={handleTryMove}
			tiles={tiles}
			columns={columns}
			rows={rows}
		/>
	)
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
		"reports a click on tile $tileIndex",
		({ tileIndex }) => {
			const { tiles, handleTryMove } = renderPuzzle({
				isFinished: false,
				isUpdating: false,
			})
			const tile = tiles[tileIndex]

			fireEvent.click(getTileButton(tile))

			expect(handleTryMove).toHaveBeenCalledOnce()
			expect(handleTryMove).toHaveBeenCalledWith(tile)
		}
	)

	it.each([{ tileIndex: 1 }, { tileIndex: 3 }])(
		"keeps the given tile positions after a click",
		({ tileIndex }) => {
			const { tiles } = renderPuzzle({
				isFinished: false,
				isUpdating: false,
			})
			const tile = tiles[tileIndex]

			fireEvent.click(getTileButton(tile))

			for (const item of tiles) {
				expectTilePlacedAtPosition({
					element: getTileElement(item.key),
					tileInfo: item,
				})
			}
		}
	)

	it.each([{ tileIndex: 1 }, { tileIndex: 3 }])(
		"renders tiles at the positions it receives",
		({ tileIndex }) => {
			const boardState = {
				isFinished: false,
				isUpdating: false,
			} as const
			const { renderResult, handleTryMove, tiles } = renderPuzzle(boardState)
			const tile = tiles[tileIndex]
			const emptySlot = getEmptyTile(tiles) as PuzzleTileInfo
			const tileElement = getTileElement(tile.key)
			const emptySlotElement = getTileElement(emptySlot.key)
			const updatedTiles = tryMove(tile, tiles)
			if (updatedTiles === null) {
				throw new Error("Expected a legal move")
			}

			renderBoard(renderResult, boardState, updatedTiles, handleTryMove)

			const movedTile = getTileByKey(tile.key, updatedTiles) as PuzzleTileInfo
			const movedEmptySlot = getTileByKey(
				emptySlot.key,
				updatedTiles
			) as PuzzleTileInfo
			expectTilePlacedAtPosition({
				element: tileElement,
				tileInfo: movedTile,
			})
			expectTilePlacedAtPosition({
				element: emptySlotElement,
				tileInfo: movedEmptySlot,
			})
		}
	)

	it("does nothing when the empty tile is clicked", () => {
		const { tiles, handleTryMove } = renderPuzzle({
			isFinished: false,
			isUpdating: false,
		})
		const emptySlot = getEmptyTile(tiles) as PuzzleTileInfo
		const button = getTileButton(emptySlot) as HTMLButtonElement

		expect(button.disabled).toBe(true)
		button.disabled = false
		fireEvent.click(button)

		expect(handleTryMove).not.toHaveBeenCalled()
		expectTilesUnmoved(tiles)
	})

	it.each([
		{ isFinished: true, isUpdating: false } as const,
		{ isFinished: true, isUpdating: true } as const,
	])(
		"does nothing when a tile is clicked and isFinished is $isFinished and isUpdating is $isUpdating",
		(boardState) => {
			const { tiles, handleTryMove } = renderPuzzle(boardState)
			const tile = tiles.find((item) => !item.isEmpty) as PuzzleTileInfo
			const button = getTileButton(tile) as HTMLButtonElement

			expect(button.disabled).toBe(true)
			button.disabled = false
			fireEvent.click(button)

			expect(handleTryMove).not.toHaveBeenCalled()
			expectTilesUnmoved(tiles)
		}
	)
})

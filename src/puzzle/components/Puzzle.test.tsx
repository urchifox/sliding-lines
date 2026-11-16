// @vitest-environment happy-dom
import { createEvent, fireEvent, render, screen } from "@testing-library/react"

import { store } from "../../store"
import { processMoveAction } from "../../store/puzzleSlice"
import { renderWithStore, rerenderWithStore } from "../../test/storeTestHelpers"
import {
	createAlmostSolvedTiles,
	expectTilePlacedAtPosition,
	expectTilesUnmoved,
	getAllTilesElements,
	getTileElements,
} from "../../test/testHelpers"
import { tryMove } from "../domain/game"
import { getEmptyTile, getTileByKey } from "../domain/tiles"
import type {
	BoardState,
	PuzzleTileInfo,
	PuzzleTilesArray,
} from "../domain/types"
import { Puzzle } from "./Puzzle"
import { getTileElementId } from "./helpers"

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
	const dispatchSpy = vi.spyOn(store, "dispatch")
	const renderResult = renderWithStore({
		ui: (
			<Puzzle
				imageInfo={imageInfo}
				boardState={boardState}
				tiles={tiles}
				columns={columns}
				rows={rows}
			/>
		),
	})
	dispatchSpy.mockClear()
	return { renderResult, dispatchSpy, tiles }
}

afterEach(() => {
	vi.restoreAllMocks()
})

function rerenderPuzzle(
	renderResult: ReturnType<typeof render>,
	boardState: BoardState,
	tiles: PuzzleTilesArray
) {
	rerenderWithStore({
		ui: (
			<Puzzle
				imageInfo={imageInfo}
				boardState={boardState}
				tiles={tiles}
				columns={columns}
				rows={rows}
			/>
		),
		renderResult,
	})
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
			const { dispatchSpy, tiles } = renderPuzzle({
				isFinished: false,
				isUpdating: false,
			})
			const tile = tiles[tileIndex]
			const { button } = getTileElements(tile.key)

			fireEvent.click(button)

			expect(dispatchSpy).toHaveBeenCalledOnce()
			expect(dispatchSpy).toHaveBeenCalledWith(processMoveAction(tile))
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
			const { button } = getTileElements(tile.key)

			fireEvent.click(button)

			for (const item of tiles) {
				const { tile: element } = getTileElements(item.key)
				expectTilePlacedAtPosition({
					element,
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
			const { renderResult, tiles } = renderPuzzle(boardState)
			const tile = tiles[tileIndex]
			const emptySlot = getEmptyTile(tiles) as PuzzleTileInfo
			const { tile: tileElement } = getTileElements(tile.key)
			const { tile: emptySlotElement } = getTileElements(emptySlot.key)
			const updatedTiles = tryMove(tile, tiles)
			if (updatedTiles === null) {
				throw new Error("Expected a legal move")
			}

			rerenderPuzzle(renderResult, boardState, updatedTiles)

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
		const { dispatchSpy, tiles } = renderPuzzle({
			isFinished: false,
			isUpdating: false,
		})
		const emptySlot = getEmptyTile(tiles) as PuzzleTileInfo
		const { button } = getTileElements(emptySlot.key)

		expect(button.disabled).toBe(true)
		button.disabled = false
		fireEvent.click(button)

		expect(dispatchSpy).not.toHaveBeenCalled()
		expectTilesUnmoved(tiles)
	})

	it.each([
		{ isFinished: true, isUpdating: false } as const,
		{ isFinished: true, isUpdating: true } as const,
	])(
		"does nothing when a tile is clicked and isFinished is $isFinished and isUpdating is $isUpdating",
		(boardState) => {
			const { dispatchSpy, tiles } = renderPuzzle(boardState)
			const tile = tiles.find((item) => !item.isEmpty) as PuzzleTileInfo
			const { button } = getTileElements(tile.key)

			expect(button.disabled).toBe(true)
			button.disabled = false
			fireEvent.click(button)

			expect(dispatchSpy).not.toHaveBeenCalled()
			expectTilesUnmoved(tiles)
		}
	)

	it("points each row at its tiles without reordering the tiles", () => {
		const boardState = {
			isFinished: false,
			isUpdating: false,
		} as const
		const { renderResult, tiles } = renderPuzzle(boardState)
		const tileOrder = () => getAllTilesElements().map((element) => element.id)
		const ownedTileIds = () =>
			screen.getAllByRole("row").map((row) => row.getAttribute("aria-owns"))

		expect(tileOrder()).toEqual(tiles.map((tile) => getTileElementId(tile.key)))
		expect(ownedTileIds()).toEqual([
			"tile-1-3 tile-1-1 tile-1-2",
			"tile-2-1 tile-2-2 tile-2-3",
			"tile-3-1 tile-3-2 tile-3-3",
		])

		const updatedTiles = tryMove(tiles[1], tiles)
		if (updatedTiles === null) {
			throw new Error("Expected a legal move")
		}
		rerenderPuzzle(renderResult, boardState, updatedTiles)

		expect(tileOrder()).toEqual(tiles.map((tile) => getTileElementId(tile.key)))
		expect(ownedTileIds()).toEqual([
			"tile-1-1 tile-1-3 tile-1-2",
			"tile-2-1 tile-2-2 tile-2-3",
			"tile-3-1 tile-3-2 tile-3-3",
		])
	})

	describe("arrow navigation", () => {
		function pressKey(button: HTMLElement, key: string) {
			const event = createEvent.keyDown(button, { key })
			fireEvent(button, event)
			return event
		}

		function expectOnlyTabStop(button: HTMLButtonElement) {
			expect(document.activeElement).toBe(button)
			expect(button.tabIndex).toBe(0)
			for (const other of screen.getAllByRole("button")) {
				if (other !== button) {
					expect(other.tabIndex).toBe(-1)
				}
			}
		}

		it.each([
			{
				key: "ArrowRight",
				expectedKey: "1-2" as const,
				preventsDefault: true,
			},
			{
				key: "ArrowLeft",
				expectedKey: "1-1" as const,
				preventsDefault: true,
			},
			{
				key: "Enter",
				expectedKey: "1-1" as const,
				preventsDefault: false,
			},
		])(
			"sets focus on $expectedKey after $key",
			({ key, expectedKey, preventsDefault }) => {
				const { dispatchSpy } = renderPuzzle({
					isFinished: false,
					isUpdating: false,
				})
				const { button: fromButton } = getTileElements("1-1")
				fromButton.focus()

				const event = pressKey(fromButton, key)
				const { button: expectedButton } = getTileElements(expectedKey)

				expect(event.defaultPrevented).toBe(preventsDefault)
				expectOnlyTabStop(expectedButton)
				expect(dispatchSpy).not.toHaveBeenCalled()
			}
		)
	})
})

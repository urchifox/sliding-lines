// @vitest-environment happy-dom
import { createSerializer } from "@emotion/jest"
import { type RenderResult, fireEvent, render } from "@testing-library/react"

import type { Level, PuzzleTileInfo } from "../domain/types"
import { Puzzle } from "./Puzzle"
import { tileLabelMatcher, getTileLabel } from "../../test/testHelpers"

expect.addSnapshotSerializer(createSerializer({ includeStyles: false }))

function getPuzzleData() {
	const level = {
		rows: 3,
		columns: 3,
		shuffleSteps: 2,
		tiles: [
			{
				key: "1-3",
				originalPosition: {
					row: 1,
					column: 3,
				},
				currentPosition: {
					row: 1,
					column: 1,
				},
				isEmpty: true,
			},
			{
				key: "1-1",
				originalPosition: {
					row: 1,
					column: 1,
				},
				currentPosition: {
					row: 1,
					column: 2,
				},
				isEmpty: false,
			},
			{
				key: "1-2",
				originalPosition: {
					row: 1,
					column: 2,
				},
				currentPosition: {
					row: 1,
					column: 3,
				},
				isEmpty: false,
			},
			{
				key: "2-1",
				originalPosition: {
					row: 2,
					column: 1,
				},
				currentPosition: {
					row: 2,
					column: 1,
				},
				isEmpty: false,
			},
			{
				key: "2-2",
				originalPosition: {
					row: 2,
					column: 2,
				},
				currentPosition: {
					row: 2,
					column: 2,
				},
				isEmpty: false,
			},
			{
				key: "2-3",
				originalPosition: {
					row: 2,
					column: 3,
				},
				currentPosition: {
					row: 2,
					column: 3,
				},
				isEmpty: false,
			},
			{
				key: "3-1",
				originalPosition: {
					row: 3,
					column: 1,
				},
				currentPosition: {
					row: 3,
					column: 1,
				},
				isEmpty: false,
			},
			{
				key: "3-2",
				originalPosition: {
					row: 3,
					column: 2,
				},
				currentPosition: {
					row: 3,
					column: 2,
				},
				isEmpty: false,
			},
			{
				key: "3-3",
				originalPosition: {
					row: 3,
					column: 3,
				},
				currentPosition: {
					row: 3,
					column: 3,
				},
				isEmpty: false,
			},
		] satisfies Array<PuzzleTileInfo>,
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

function getTileElement(renderResult: RenderResult, tile: PuzzleTileInfo) {
	return renderResult.getByRole("listitem", { name: getTileLabel(tile.key) })
}

function getTileButton(tileElement: HTMLElement) {
	return tileElement.querySelector('button') as HTMLButtonElement
}

function getAllTilesElements(renderResult: RenderResult) {
	return renderResult.getAllByRole("listitem", { name: tileLabelMatcher })
}

describe("Puzzle", () => {
	it.each([
		{ isFinished: false, isUpdating: false },
		{ isFinished: true, isUpdating: true },
	])(
		"renders correctly with states isFinished: $isFinished, isUpdating: $isUpdating",
		({ isFinished, isUpdating }) => {
			const { level, imageInfo, onCompleteLevel } = getPuzzleData()

			const renderResult = render(
				<Puzzle
					imageInfo={imageInfo}
					onCompleteLevel={onCompleteLevel}
					isFinished={isFinished}
					isUpdating={isUpdating}
					level={level}
				/>
			)

			expect(renderResult.container).toMatchSnapshot()
		}
	)

	it.each([{ tileIndex: 1 }, { tileIndex: 3 }])(
		"swaps tile with empty slot",
		({ tileIndex }) => {
			const { level, imageInfo, onCompleteLevel, emptySlot } = getPuzzleData()
			const tile = level.tiles[tileIndex]
			const tileInitialPosition = structuredClone(tile.currentPosition)
			const emptySlotInitialPosition = structuredClone(
				emptySlot.currentPosition
			)
			const renderResult = render(
				<Puzzle
					imageInfo={imageInfo}
					onCompleteLevel={onCompleteLevel}
					isFinished={false}
					isUpdating={false}
					level={level}
				/>
			)

			const tileElement = getTileElement(renderResult, tile)
			const tileButton = getTileButton(tileElement)
			const emptySlotElement = getTileElement(renderResult, emptySlot)
			fireEvent.click(tileButton)

			expect(tileElement.style.getPropertyValue("--row")).toBe(
				emptySlotInitialPosition.row.toString()
			)
			expect(tileElement.style.getPropertyValue("--col")).toBe(
				emptySlotInitialPosition.column.toString()
			)
			expect(emptySlotElement.style.getPropertyValue("--row")).toBe(
				tileInitialPosition.row.toString()
			)
			expect(emptySlotElement.style.getPropertyValue("--col")).toBe(
				tileInitialPosition.column.toString()
			)
		}
	)

	it("ignores clicks on empty slot", () => {
		const { level, imageInfo, onCompleteLevel, emptySlot } = getPuzzleData()
		const renderResult = render(
			<Puzzle
				imageInfo={imageInfo}
				onCompleteLevel={onCompleteLevel}
				isFinished={false}
				isUpdating={false}
				level={level}
			/>
		)
		const emptySlotElement = getTileElement(renderResult, emptySlot)
		const tilesElements = getAllTilesElements(renderResult)

		fireEvent.click(emptySlotElement)

		expect(tilesElements.length).toBe(level.tiles.length)
		for (const tilesElement of tilesElements) {
			expect(tilesElement).toBeInTheDocument()
			expect(tilesElement.style.getPropertyValue("--row") === "").toBe(true)
			expect(tilesElement.style.getPropertyValue("--col") === "").toBe(true)
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
			const { level, imageInfo, onCompleteLevel } = getPuzzleData()
			const tile = level.tiles[tileIndex]
			const renderResult = render(
				<Puzzle
					imageInfo={imageInfo}
					onCompleteLevel={onCompleteLevel}
					isFinished={false}
					isUpdating={false}
					level={level}
				/>
			)
			const tileElement = getTileElement(renderResult, tile)
			const tilesElements = getAllTilesElements(renderResult)
			const tileButton = getTileButton(tileElement)

			fireEvent.click(tileButton)

			expect(tilesElements.length).toBe(level.tiles.length)
			for (const tilesElement of tilesElements) {
				expect(tilesElement).toBeInTheDocument()
				expect(tilesElement.style.getPropertyValue("--row") === "").toBe(true)
				expect(tilesElement.style.getPropertyValue("--col") === "").toBe(true)
			}
			expect(onCompleteLevel).not.toHaveBeenCalled()
		}
	)

	it.each([{ tileIndex: 1 }, { tileIndex: 3 }])(
		"ignores clicks on tiles when isFinished is true",
		({ tileIndex }) => {
			const { level, imageInfo, onCompleteLevel } = getPuzzleData()
			const tile = level.tiles[tileIndex]
			const renderResult = render(
				<Puzzle
					imageInfo={imageInfo}
					onCompleteLevel={onCompleteLevel}
					isFinished={true}
					isUpdating={false}
					level={level}
				/>
			)
			const tileElement = getTileElement(renderResult, tile)
			const tilesElements = getAllTilesElements(renderResult)
			const tileButton = getTileButton(tileElement)
			
			fireEvent.click(tileButton)

			expect(tilesElements.length).toBe(level.tiles.length)
			for (const tilesElement of tilesElements) {
				expect(tilesElement).toBeInTheDocument()
				expect(tilesElement.style.getPropertyValue("--row") === "").toBe(true)
				expect(tilesElement.style.getPropertyValue("--col") === "").toBe(true)
			}
			expect(onCompleteLevel).not.toHaveBeenCalled()
		}
	)

	it.each([{ tileIndex: 1 }, { tileIndex: 3 }])(
		"ignores clicks on tiles when isUpdating is true",
		({ tileIndex }) => {
			const { level, imageInfo, onCompleteLevel } = getPuzzleData()
			const tile = level.tiles[tileIndex]
			const renderResult = render(
				<Puzzle
					imageInfo={imageInfo}
					onCompleteLevel={onCompleteLevel}
					isFinished={false}
					isUpdating={true}
					level={level}
				/>
			)
			const tileElement = getTileElement(renderResult, tile)
			const tilesElements = getAllTilesElements(renderResult)
			const tileButton = getTileButton(tileElement)

			fireEvent.click(tileButton)

			expect(tilesElements.length).toBe(level.tiles.length)
			for (const tilesElement of tilesElements) {
				expect(tilesElement).toBeInTheDocument()
				expect(tilesElement.style.getPropertyValue("--row") === "").toBe(true)
				expect(tilesElement.style.getPropertyValue("--col") === "").toBe(true)
			}
			expect(onCompleteLevel).not.toHaveBeenCalled()
		}
	)

	it("calls onCompleteLevel when all tiles are in the correct position", () => {
		const { level, imageInfo, onCompleteLevel, emptySlot } = getPuzzleData()
		const tile1 = level.tiles[1]
		const tile2 = level.tiles[2]
		const renderResult = render(
			<Puzzle
				imageInfo={imageInfo}
				onCompleteLevel={onCompleteLevel}
				isFinished={false}
				isUpdating={false}
				level={level}
			/>
		)
		const tile1Element = getTileElement(renderResult, tile1)
		const tile1Button = getTileButton(tile1Element)
		const tile2Element = getTileElement(renderResult, tile2)
		const tile2Button = getTileButton(tile2Element)
		const emptySlotElement = getTileElement(renderResult, emptySlot)
		const tilesElements = getAllTilesElements(renderResult)

		fireEvent.click(tile1Button)
		expect(onCompleteLevel).not.toHaveBeenCalled()

		fireEvent.click(tile2Button)
		expect(onCompleteLevel).toHaveBeenCalledOnce()

		expect(emptySlotElement.style.getPropertyValue("--row")).toBe(
			emptySlot.originalPosition.row.toString()
		)
		expect(emptySlotElement.style.getPropertyValue("--col")).toBe(
			emptySlot.originalPosition.column.toString()
		)
		expect(tile1Element.style.getPropertyValue("--row")).toBe(
			tile1.originalPosition.row.toString()
		)
		expect(tile1Element.style.getPropertyValue("--col")).toBe(
			tile1.originalPosition.column.toString()
		)
		expect(tile2Element.style.getPropertyValue("--row")).toBe(
			tile2.originalPosition.row.toString()
		)
		expect(tile2Element.style.getPropertyValue("--col")).toBe(
			tile2.originalPosition.column.toString()
		)

		for (const tilesElement of tilesElements) {
			if (
				tilesElement === tile1Element ||
				tilesElement === tile2Element ||
				tilesElement === emptySlotElement
			) {
				continue
			}
			expect(tilesElement.style.getPropertyValue("--row")).toBe("")
			expect(tilesElement.style.getPropertyValue("--col")).toBe("")
		}
	})
})

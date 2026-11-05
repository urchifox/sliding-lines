import { screen } from "@testing-library/react"

import {
	getTileButtonText,
	getTileLabel,
	puzzleBoardName,
	tileLabelMatcher,
} from "../puzzle/components/helpers"
import type { PuzzleTileInfo, TileKey } from "../puzzle/domain/types"

export type Deferred<T> = {
	promise: Promise<T>
	resolve: (value: T) => T
	reject: () => void
}

export function createDeferred<T>(): Deferred<T> {
	let resolve: Deferred<T>["resolve"] = () => undefined as T
	let reject: Deferred<T>["reject"] = () => undefined
	const promise = new Promise<T>((res, rej) => {
		resolve = (value: T) => {
			res(value)
			return value
		}
		reject = rej
	})
	return { promise, resolve, reject }
}

export function getTileElement(key: TileKey) {
	const label = getTileLabel(key)
	return screen.getByRole("listitem", { name: label })
}

export function getTileButton(tile: PuzzleTileInfo) {
	const text = getTileButtonText(tile.currentPosition)
	return screen.getByRole("button", { name: text })
}

export function getAllTilesElements() {
	return screen.getAllByRole("listitem", { name: tileLabelMatcher })
}

export function getPuzzleBoard() {
	return screen.getByRole("list", { name: puzzleBoardName })
}

export function queryPuzzleBoard() {
	return screen.queryByRole("list", { name: puzzleBoardName })
}

export function createTile(props: {
	originalRow: number
	originalColumn: number
	currentRow?: number
	currentColumn?: number
	isEmpty?: boolean
}): PuzzleTileInfo {
	const {
		originalRow,
		originalColumn,
		currentRow = originalRow,
		currentColumn = originalColumn,
		isEmpty = false,
	} = props
	return {
		key: `${originalRow}-${originalColumn}` as TileKey,
		originalPosition: { row: originalRow, column: originalColumn },
		currentPosition: { row: currentRow, column: currentColumn },
		isEmpty,
	}
}

export function expectTileBeingMovedAt({
	element,
	row,
	column,
}: {
	element: HTMLElement
	row: number
	column: number
}) {
	expect(element.style.getPropertyValue("--row")).toBe(row.toString())
	expect(element.style.getPropertyValue("--col")).toBe(column.toString())
}

export function expectTileNotBeingMoved(element: HTMLElement) {
	expect(element.style.getPropertyValue("--row")).toBe("")
	expect(element.style.getPropertyValue("--col")).toBe("")
}

export function createAlmostSolvedTiles() {
	return [
		createTile({
			originalRow: 1,
			originalColumn: 3,
			currentRow: 1,
			currentColumn: 1,
			isEmpty: true,
		}),
		createTile({
			originalRow: 1,
			originalColumn: 1,
			currentRow: 1,
			currentColumn: 2,
		}),
		createTile({
			originalRow: 1,
			originalColumn: 2,
			currentRow: 1,
			currentColumn: 3,
		}),
		createTile({ originalRow: 2, originalColumn: 1 }),
		createTile({ originalRow: 2, originalColumn: 2 }),
		createTile({ originalRow: 2, originalColumn: 3 }),
		createTile({ originalRow: 3, originalColumn: 1 }),
		createTile({ originalRow: 3, originalColumn: 2 }),
		createTile({ originalRow: 3, originalColumn: 3 }),
	] satisfies Array<PuzzleTileInfo>
}

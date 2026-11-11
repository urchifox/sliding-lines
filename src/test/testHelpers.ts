import { screen } from "@testing-library/react"

import {
	getTileButtonText,
	getTileLabel,
	puzzleBoardName,
	tileLabelMatcher,
} from "../puzzle/components/helpers"
import type {
	PuzzleTileInfo,
	PuzzleTilesArray,
	TileKey,
} from "../puzzle/domain/types"

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

export function getTileElements(key: TileKey) {
	const label = getTileLabel(key)
	const tile = screen.getByRole("gridcell", { name: label })
	const button = tile.querySelector("button") as HTMLButtonElement
	return { tile, button }
}

export function getAllTilesElements() {
	return screen.getAllByRole("gridcell", { name: tileLabelMatcher })
}

export function getPuzzleBoard() {
	return screen.getByRole("grid", { name: puzzleBoardName })
}

export function queryPuzzleBoard() {
	return screen.queryByRole("grid", { name: puzzleBoardName })
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

export function expectTilePlacedAtPosition({
	element,
	tileInfo,
}: {
	element: HTMLElement
	tileInfo: PuzzleTileInfo
}) {
	expect(element).toHaveStyle({
		"--row": tileInfo.currentPosition.row.toString(),
		"--col": tileInfo.currentPosition.column.toString(),
	})
	const button = element.querySelector("button")
	expect(button?.textContent).toBe(getTileButtonText(tileInfo))
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
	] satisfies PuzzleTilesArray
}

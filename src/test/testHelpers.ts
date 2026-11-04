import { screen } from "@testing-library/react"

import type { Position, PuzzleTileInfo, TileKey } from "../puzzle/domain/types"

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

export const tileLabelPrefix = "Tile "
export const tileLabelMatcher = new RegExp(`${tileLabelPrefix}\\d-\\d`)

export function getTileLabel(key: TileKey): string {
	return `${tileLabelPrefix}${key}`
}

export function getTileElement(key: TileKey) {
	const label = getTileLabel(key)
	return screen.getByRole("listitem", { name: label })
}

export function getTileButtonText(currentPosition: Position): string {
	return `Try move tile in ${currentPosition.row} row and ${currentPosition.column} column`
}

export function getTileButton(tile: PuzzleTileInfo) {
	const text = getTileButtonText(tile.currentPosition)
	return screen.getByRole("button", { name: text })
}

export function getAllTilesElements() {
	return screen.getAllByRole("listitem", { name: tileLabelMatcher })
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

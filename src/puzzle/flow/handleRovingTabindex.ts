import { clamp } from "../../shared/utils"
import { getTileByCurrentPosition, getTileByKey } from "../domain/tiles"
import type { PuzzleTileInfo, PuzzleTilesArray, TileKey } from "../domain/types"

export enum SIDE {
	LEFT = "LEFT",
	RIGHT = "RIGHT",
	UP = "UP",
	DOWN = "DOWN",
}

const arrowKeyToSideMap = {
	ArrowLeft: SIDE.LEFT,
	ArrowRight: SIDE.RIGHT,
	ArrowUp: SIDE.UP,
	ArrowDown: SIDE.DOWN,
}

export const positionDiff = {
	[SIDE.LEFT]: [0, -1],
	[SIDE.RIGHT]: [0, 1],
	[SIDE.UP]: [-1, 0],
	[SIDE.DOWN]: [1, 0],
}

export function handleRovingTabindex({
	tiles,
	tileKey,
	arrowKey,
	columns,
	rows,
}: {
	tiles: PuzzleTilesArray
	tileKey: TileKey
	arrowKey: string
	columns: number
	rows: number
}): TileKey | null {
	if (!(arrowKey in arrowKeyToSideMap)) {
		return null
	}

	const focusedTile = getTileByKey(tileKey, tiles)
	if (focusedTile === undefined) {
		return null
	}

	const side = arrowKeyToSideMap[arrowKey as keyof typeof arrowKeyToSideMap]

	let tileAtSide = getTileAtSide({
		tiles,
		tile: focusedTile,
		side: side,
		rows,
		columns,
	})

	if (tileAtSide?.isEmpty) {
		tileAtSide = getTileAtSide({
			tiles,
			tile: tileAtSide,
			side: side,
			rows,
			columns,
		})
	}

	return tileAtSide?.key ?? null
}

function getTileAtSide({
	tiles,
	tile,
	side,
	rows,
	columns,
}: {
	tiles: PuzzleTilesArray
	tile: PuzzleTileInfo
	side: SIDE
	rows: number
	columns: number
}): PuzzleTileInfo | null {
	const [rowDiff, columnDiff] = positionDiff[side]

	const nextRow = clamp({
		min: 1,
		max: rows,
		value: tile.currentPosition.row + rowDiff,
	})
	const nextColumn = clamp({
		min: 1,
		max: columns,
		value: tile.currentPosition.column + columnDiff,
	})

	const tileAtSide = getTileByCurrentPosition(
		{ row: nextRow, column: nextColumn },
		tiles
	)

	if (tileAtSide === undefined || tileAtSide === tile) {
		return null
	}

	return tileAtSide
}

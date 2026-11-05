import type { Position, TileKey } from "../domain/types"

export function getTileButtonText(currentPosition: Position): string {
	return `Try move tile in ${currentPosition.row} row and ${currentPosition.column} column`
}

export const tileLabelPrefix = "Tile "
export const tileLabelMatcher = new RegExp(`${tileLabelPrefix}\\d-\\d`)
export function getTileLabel(key: TileKey): string {
	return `${tileLabelPrefix}${key}`
}

export const puzzleBoardName = "Puzzle board"

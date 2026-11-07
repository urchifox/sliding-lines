import type { PuzzleTileInfo, TileKey } from "../domain/types"

export function getTileButtonText(tileInfo: PuzzleTileInfo): string {
	return `Try move tile ${tileInfo.key} at row ${tileInfo.currentPosition.row}, column ${tileInfo.currentPosition.column}`
}

export const tileLabelPrefix = "Tile "
export const tileLabelMatcher = new RegExp(`${tileLabelPrefix}\\d-\\d`)
export function getTileLabel(key: TileKey): string {
	return `${tileLabelPrefix}${key}`
}

export const puzzleBoardName = "Puzzle board"

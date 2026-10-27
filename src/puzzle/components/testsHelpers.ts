import type { TileKey } from "../domain/types"

export const tileLabelPrefix = "Tile "

export function getTileLabel(key: TileKey): string {
	return `${tileLabelPrefix}${key}`
}

export const tileLabelMatcher = new RegExp(`${tileLabelPrefix}\\d-\\d`)

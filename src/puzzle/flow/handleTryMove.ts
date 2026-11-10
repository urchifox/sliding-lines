import { upgradeLevel } from "../../progress/user"
import { isPuzzleSolved, tryMove } from "../domain/game"
import type { PuzzleTileInfo, PuzzleTilesArray } from "../domain/types"

export function handleTryMove({
	tile,
	tiles,
	onSolved,
}: {
	tile: PuzzleTileInfo
	tiles: PuzzleTilesArray
	onSolved?: () => void
}) {
	const updatedTiles = tryMove(tile, tiles)
	if (updatedTiles === null) {
		return tiles
	}

	if (isPuzzleSolved(updatedTiles)) {
		upgradeLevel()
		onSolved?.()
	}

	return updatedTiles
}

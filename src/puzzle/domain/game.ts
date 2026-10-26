import { upgradeLevel } from "../../progress/user"
import type { Position, PuzzleTileInfo } from "./types"

export function tryMove(
	tile: PuzzleTileInfo,
	tiles: Array<PuzzleTileInfo>
): {
	isSolved: boolean
	updatedTiles: Array<PuzzleTileInfo> | null
} {
	const neighbors = getCurrentNeighborsOf(tile.currentPosition, tiles)
	const emptySlot = neighbors.find((element) => element.isEmpty)

	if (emptySlot === undefined) {
		return {
			isSolved: false,
			updatedTiles: null,
		}
	}

	swap({ tile1: emptySlot, tile2: tile })

	const isSolved = isPuzzleSolved(tiles)
	if (isSolved) {
		upgradeLevel()
	}

	return {
		isSolved,
		updatedTiles: [emptySlot, tile],
	}
}

export function getCurrentNeighborsOf(
	position: Position,
	tiles: Array<PuzzleTileInfo>
) {
	const { row, column } = position
	const neighbors = [
		{ row: row - 1, column },
		{ row: row + 1, column },
		{ row, column: column - 1 },
		{ row, column: column + 1 },
	]

	const elements = []
	for (const neighbor of neighbors) {
		const neighborElement = tiles.find(
			(element) =>
				element.currentPosition.row === neighbor.row &&
				element.currentPosition.column === neighbor.column
		)

		if (neighborElement !== undefined) {
			elements.push(neighborElement)
		}
	}

	return elements
}

export function swap({
	tile1,
	tile2,
}: {
	tile1: PuzzleTileInfo
	tile2: PuzzleTileInfo
}) {
	const tilePosition = tile2.currentPosition
	const emptyPosition = tile1.currentPosition

	tile2.currentPosition = emptyPosition
	tile1.currentPosition = tilePosition
}

function isPuzzleSolved(tiles: Array<PuzzleTileInfo>) {
	return tiles.every(
		({ currentPosition, originalPosition }) =>
			currentPosition.row === originalPosition.row &&
			currentPosition.column === originalPosition.column
	)
}

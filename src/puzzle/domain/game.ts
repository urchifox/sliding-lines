import type { PuzzleTileInfo } from "./types"

export function tryMove(tile: PuzzleTileInfo, tiles: Array<PuzzleTileInfo>) {
	const neighbors = getNeighborsOf(tile, tiles)
	const emptySlot = neighbors.find((element) => element.isEmpty)

	if (emptySlot === undefined) {
		return {
			isFinished: false,
			updatedTiles: null,
		}
	}

	swap({ emptySlot, tile })

	return {
		isFinished: isPuzzleSolved(tiles),
		updatedTiles: [emptySlot, tile],
	}
}

export function getNeighborsOf(
	tile: PuzzleTileInfo,
	tiles: Array<PuzzleTileInfo>
) {
	const { row, column } = tile.currentPosition
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
	emptySlot,
	tile,
}: {
	emptySlot: PuzzleTileInfo
	tile: PuzzleTileInfo
}) {
	const tilePosition = tile.currentPosition
	const emptyPosition = emptySlot.currentPosition

	tile.currentPosition = emptyPosition
	emptySlot.currentPosition = tilePosition
}

function isPuzzleSolved(tiles: Array<PuzzleTileInfo>) {
	return tiles.every(
		({ currentPosition, originalPosition }) =>
			currentPosition.row === originalPosition.row &&
			currentPosition.column === originalPosition.column
	)
}

import type { PuzzleTileInfo } from "./types"

export function tryMove(tile: PuzzleTileInfo, tiles: Array<PuzzleTileInfo>) {
	const neighbors = getNeighborsOf(tile, tiles)
	const emptySlot = neighbors.find((element) => element.isEmpty)

	if (emptySlot === undefined) {
		return false
	}

	swap({ emptySlot, tile })

	return true
}

export function getNeighborsOf(
	tile: PuzzleTileInfo,
	tiles: Array<PuzzleTileInfo>
) {
	const { row, column } = tile.current
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
				element.current.row === neighbor.row &&
				element.current.column === neighbor.column
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
	const tilePosition = tile.current
	const emptyPosition = emptySlot.current

	tile.current = emptyPosition
	emptySlot.current = tilePosition
}

export function isSolved(tiles: Array<PuzzleTileInfo>) {
	return tiles.every(
		({ current, original }) =>
			current.row === original.row && current.column === original.column
	)
}

import type { Position, PuzzleTileInfo, PuzzleTilesArray } from "./types"

export function tryMove(tileToMove: PuzzleTileInfo, tiles: PuzzleTilesArray) {
	if (tileToMove.isEmpty || isPuzzleSolved(tiles)) {
		return null
	}

	const neighbors = getCurrentNeighborsOf(tileToMove.currentPosition, tiles)
	const emptySlot = neighbors.find((element) => element.isEmpty)

	if (emptySlot === undefined) {
		return null
	}

	const [newEmptySlot, newTile] = swap({ tile1: emptySlot, tile2: tileToMove })
	const updatedTiles = tiles.map((tile) => {
		if (tile.key === newEmptySlot.key) {
			return newEmptySlot
		}
		if (tile.key === newTile.key) {
			return newTile
		}
		return tile
	})

	return updatedTiles
}

export function getCurrentNeighborsOf(
	position: Position,
	tiles: PuzzleTilesArray
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
	const tile1Position = { ...tile1.currentPosition }
	const tile2Position = { ...tile2.currentPosition }

	return [
		{ ...tile1, currentPosition: tile2Position },
		{ ...tile2, currentPosition: tile1Position },
	]
}

export function isPuzzleSolved(tiles: PuzzleTilesArray) {
	return tiles.every(
		({ currentPosition, originalPosition }) =>
			currentPosition.row === originalPosition.row &&
			currentPosition.column === originalPosition.column
	)
}

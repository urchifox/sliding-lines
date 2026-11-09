import { pickRandomItem, replaceItem } from "../../shared/utils"
import { getCurrentNeighborsOf, swap } from "./game"
import type { PuzzleTileInfo, PuzzleTilesArray, TileKey } from "./types"

export function createTiles(
	rows: number,
	columns: number,
	emptySlotIndex: number
): PuzzleTilesArray {
	const tiles = []
	let index = 0
	for (let row = 1; row <= rows; row++) {
		for (let column = 1; column <= columns; column++) {
			tiles.push({
				key: createTileKey(row, column),
				originalPosition: { row, column },
				currentPosition: { row, column },
				isEmpty: index === emptySlotIndex,
			})
			index++
		}
	}

	return tiles
}

export function createTileKey(row: number, column: number): TileKey {
	return `${row}-${column}`
}

export function shuffleTiles({
	tiles,
	shuffleSteps,
}: {
	tiles: PuzzleTilesArray
	shuffleSteps: number
}) {
	const shuffledTiles = [...tiles]
	let emptySlot = shuffledTiles.find((tile) => tile.isEmpty)
	if (emptySlot === undefined) {
		throw new Error("Empty slot not found")
	}

	let stepsRemained = shuffleSteps
	let lastTile: PuzzleTileInfo | undefined = undefined

	while (stepsRemained > 0) {
		const neighbors = getCurrentNeighborsOf(
			emptySlot.currentPosition,
			shuffledTiles
		)

		if (lastTile !== undefined) {
			replaceItem(neighbors, lastTile)
		}

		const tile = pickRandomItem(neighbors)

		const [newEmptySlot, newTile] = swap({ tile1: emptySlot, tile2: tile })
		replaceItem(shuffledTiles, emptySlot, newEmptySlot)
		replaceItem(shuffledTiles, tile, newTile)
		lastTile = newTile
		emptySlot = newEmptySlot

		stepsRemained--
	}

	return shuffledTiles
}

export function reshuffleTiles({
	tiles,
	shuffleSteps,
}: {
	tiles: PuzzleTilesArray
	shuffleSteps: number
}) {
	const resetedTiles = resetTiles(tiles)
	const shuffledTiles = shuffleTiles({ tiles: resetedTiles, shuffleSteps })

	return shuffledTiles
}

export function resetTiles(tiles: PuzzleTilesArray) {
	const resetedTiles = tiles.map((tile) => ({
		...tile,
		currentPosition: { ...tile.originalPosition },
	}))

	return resetedTiles
}

import {
	deleteFromArray,
	getRandomNumber,
	pickRandomItem,
} from "../../shared/utils"
import { getCurrentNeighborsOf, swap } from "./game"
import type { Level, LevelConfig, PuzzleTileInfo, TileKey } from "./types"

const levelExtreme = {
	rows: {
		min: 3,
		max: 5,
	},
	columns: {
		min: 3,
		max: 5,
	},
	shuffleSteps: {
		min: 5,
		max: 10,
	},
} as const

const maxDifficultyLevel = 10

export function createLevel(levelNumber: number): Level {
	const levelConfig = generateConfig(levelNumber)

	const { rows, columns, shuffleSteps } = levelConfig
	const tiles = createTiles(rows, columns)

	const emptySlotIndex = getRandomNumber({ min: 0, max: tiles.length - 1 })
	tiles[emptySlotIndex].isEmpty = true

	const level = { tiles, columns, rows, shuffleSteps }

	shuffleLevel(level)

	return level
}

function createTiles(rows: number, columns: number): Array<PuzzleTileInfo> {
	const tiles = []
	for (let row = 1; row <= rows; row++) {
		for (let column = 1; column <= columns; column++) {
			tiles.push({
				key: createTileKey(row, column),
				originalPosition: { row, column },
				currentPosition: { row, column },
				isEmpty: false,
			})
		}
	}
	return tiles
}

function createTileKey(row: number, column: number): TileKey {
	return `${row}-${column}`
}

function generateConfig(levelNumber: number): LevelConfig {
	const config = {} as LevelConfig

	Object.entries(levelExtreme).forEach(([name, { min, max }]) => {
		const difficulty = Math.max(
			0,
			Math.min(1, levelNumber / maxDifficultyLevel)
		)
		const value = min + (max - min) * difficulty

		config[name as keyof typeof levelExtreme] = Math.round(value)
	})

	return config
}

export function resetLevel(level: Level) {
	const { tiles } = level
	tiles.forEach((tile) => {
		tile.currentPosition = { ...tile.originalPosition }
	})
}

export function shuffleLevel(level: Level) {
	const { tiles, shuffleSteps } = level
	const emptySlot = tiles.find((tile) => tile.isEmpty)
	if (emptySlot === undefined) {
		throw new Error("Empty slot not found")
	}

	let steps = shuffleSteps
	let lastTile: PuzzleTileInfo | undefined = undefined

	while (steps > 0) {
		const neighbors = getCurrentNeighborsOf(emptySlot.currentPosition, tiles)

		if (lastTile !== undefined) {
			deleteFromArray(neighbors, lastTile)
		}

		const tile = pickRandomItem(neighbors)
		swap({ tile1: emptySlot, tile2: tile })
		lastTile = tile

		steps--
	}
}

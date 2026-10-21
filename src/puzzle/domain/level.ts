import { deleteFromArray, getRandomNumber, randomPick } from "../../shared/utils";
import { getNeighborsOf, swap } from "./game";
import type { Level, LevelConfig, PuzzleTileInfo } from "./types";

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
} as const;

const maxDifficultyLevel = 10

export function createLevel(levelNumber: number): Level {
	const levelConfig = generateConfig(levelNumber)

	const { rows, columns, shuffleSteps } = levelConfig
	const tiles = createTiles(rows, columns)

	const emptySlotIndex = getRandomNumber({ min: 0, max: tiles.length - 1 })
	tiles[emptySlotIndex].isEmpty = true

	const level = { tiles, columns, rows, emptySlotIndex, shuffleSteps }

	shuffleLevel(level)

	return level
}

function createTiles(rows: number, columns: number): Array<PuzzleTileInfo> {
	const tiles = []
	for (let row = 1; row <= rows; row++) {
		for (let column = 1; column <= columns; column++) {
			tiles.push({
				key: `${row}-${column}`,
				originalPosition: { row, column },
				currentPosition: { row, column },
				isEmpty: false,
			})
		}
	}
	return tiles
}

function generateConfig(levelNumber: number): LevelConfig {
	const config = {} as LevelConfig

	Object.entries(levelExtreme).forEach(([name, { min, max }]) => {
		const difficulty = Math.min(1, levelNumber / maxDifficultyLevel)
		const value = min + (max - min) * difficulty

		config[name as keyof typeof levelExtreme] = Math.round(value)
	})

	return config
}

function shuffleLevel(level: Level) {
	const { tiles, emptySlotIndex, shuffleSteps } = level
	const emptySlot = tiles[emptySlotIndex]

	let steps =
		typeof shuffleSteps === "number"
			? shuffleSteps
			: getRandomNumber(shuffleSteps)
	let lastTile: PuzzleTileInfo | undefined = undefined

	while (steps > 0) {
		const neighbors = getNeighborsOf(emptySlot, tiles)

		if (lastTile !== undefined) {
			deleteFromArray(neighbors, lastTile)
		}

		const tile = randomPick(neighbors)
		swap({ emptySlot, tile })
		lastTile = tile

		steps--
	}
}

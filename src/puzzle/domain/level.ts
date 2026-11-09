import { getRandomNumber } from "../../shared/utils"
import { createTiles, shuffleTiles } from "./tiles"
import type { Level, LevelConfig } from "./types"

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
	const emptySlotIndex = getRandomNumber({ min: 0, max: rows * columns - 1 })
	const tiles = createTiles(rows, columns, emptySlotIndex)

	const shuffledTiles = shuffleTiles({ tiles, shuffleSteps })

	const level = { tiles: shuffledTiles, columns, rows, shuffleSteps }

	return level
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

import { deleteFromArray, getRandomNumber, randomPick } from "./utils"

export type Position = {
	row: number
	column: number
}

export type PuzzleTileInfo = {
	key: string
	original: Position
	current: Position
	isEmpty: boolean
}

export type Level = LevelConfig & {
	tiles: Array<PuzzleTileInfo>
	emptySlotIndex: number
}

export type LevelConfig = {
	rows: number
	columns: number
	shuffleSteps:
		| number
		| {
				min: number
				max: number
		  }
}

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
				original: { row, column },
				current: { row, column },
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

		config[name as keyof typeof levelExtreme] = value
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

function getNeighborsOf(tile: PuzzleTileInfo, tiles: Array<PuzzleTileInfo>) {
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

export function tryMove(tile: PuzzleTileInfo, tiles: Array<PuzzleTileInfo>) {
	const neighbors = getNeighborsOf(tile, tiles)
	const emptySlot = neighbors.find((element) => element.isEmpty)

	if (emptySlot === undefined) {
		return false
	}

	swap({ emptySlot, tile })

	return true
}

function swap({
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

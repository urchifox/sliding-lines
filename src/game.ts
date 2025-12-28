import { saveUserInfo, userInfo } from "./user"
import { deleteFromArray, getRandomInteger, randomPick } from "./utils"

export type Position = {
	row: number
	column: number
}

export type PuzzleItemInfo = {
	key: string
	original: Position
	current: Position
	isEmpty: boolean
}

export type Level = LevelConfig & {
	items: Array<PuzzleItemInfo>
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

export function getLevelNumber() {
	return userInfo.levelNumber
}

export function upgradeLevel() {
	userInfo.levelNumber++
	saveUserInfo()
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

export function createLevel(levelNumber?: number): Level {
	const levelConfig = generateConfig(levelNumber)

	const { rows, columns, shuffleSteps } = levelConfig
	const items = []
	for (let row = 1; row <= rows; row++) {
		for (let column = 1; column <= columns; column++) {
			items.push({
				key: `${row}-${column}`,
				original: { row, column },
				current: { row, column },
				isEmpty: false,
			})
		}
	}

	const emptySlotIndex = getRandomInteger(0, items.length - 1)
	items[emptySlotIndex].isEmpty = true

	const level = { items, columns, rows, emptySlotIndex, shuffleSteps }

	shuffleLevel(level)

	return level
}

function generateConfig(levelNumber?: number): LevelConfig {
	const config = {} as LevelConfig

	Object.entries(levelExtreme).forEach(([name, { min, max }]) => {
		const difficulty = (levelNumber ?? getLevelNumber()) / maxDifficultyLevel
		const extremeDiff = max - min
		const randomisationDiff = difficulty > 1 ? Math.round(0.3 * extremeDiff) : 0
		const minValue = min + extremeDiff * difficulty
		const maxValue = minValue + randomisationDiff
		const value = getRandomInteger(minValue, maxValue)

		config[name as keyof typeof levelExtreme] = value
	})

	return config
}

function shuffleLevel(level: Level) {
	const { items, emptySlotIndex, shuffleSteps } = level
	const emptySlot = items[emptySlotIndex]

	let steps =
		typeof shuffleSteps === "number"
			? shuffleSteps
			: getRandomInteger(shuffleSteps.min, shuffleSteps.max)
	let lastItem: PuzzleItemInfo | undefined = undefined

	while (steps > 0) {
		const neighbors = getNeighborsOf(emptySlot, items)

		if (lastItem !== undefined) {
			deleteFromArray(neighbors, lastItem)
		}

		const item = randomPick(neighbors)
		swap({ emptySlot, item })
		lastItem = item

		steps--
	}
}

function getNeighborsOf(item: PuzzleItemInfo, items: Array<PuzzleItemInfo>) {
	const { row, column } = item.current
	const neighbors = [
		{ row: row - 1, column },
		{ row: row + 1, column },
		{ row, column: column - 1 },
		{ row, column: column + 1 },
	]

	const elements = []
	for (const neighbor of neighbors) {
		const neighborElement = items.find(
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

export function tryMove(item: PuzzleItemInfo, items: Array<PuzzleItemInfo>) {
	const neighbors = getNeighborsOf(item, items)
	const emptySlot = neighbors.find((element) => element.isEmpty)

	if (emptySlot === undefined) {
		return false
	}

	swap({ emptySlot, item })

	return true
}

function swap({
	emptySlot,
	item,
}: {
	emptySlot: PuzzleItemInfo
	item: PuzzleItemInfo
}) {
	const itemPosition = item.current
	const emptyPosition = emptySlot.current

	item.current = emptyPosition
	emptySlot.current = itemPosition
}

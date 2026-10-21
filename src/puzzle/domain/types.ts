export type Position = {
	row: number
	column: number
}

export type PuzzleTileInfo = {
	key: string
	originalPosition: Position
	currentPosition: Position
	isEmpty: boolean
}

export type Level = LevelConfig & {
	tiles: Array<PuzzleTileInfo>
	emptySlotIndex: number
}

export type LevelConfig = {
	rows: number
	columns: number
	shuffleSteps: number |
	{
		min: number
		max: number
	}
}


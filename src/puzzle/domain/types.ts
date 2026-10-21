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
	shuffleSteps: number |
	{
		min: number
		max: number
	}
}


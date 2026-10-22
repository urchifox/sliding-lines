export type Position = {
	row: number
	column: number
}

export type PuzzleTileInfo = {
	key: TileKey
	originalPosition: Position
	currentPosition: Position
	isEmpty: boolean
}

export type TileKey = `${number}-${number}`

export type Level = LevelConfig & {
	tiles: Array<PuzzleTileInfo>
	emptySlotIndex: number
}

export type LevelConfig = {
	rows: number
	columns: number
	shuffleSteps: number
}

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

export type PuzzleData = {
	levelNumber: number
	level: Level
	imageInfo: ImageInfo
}

export type Level = LevelConfig & {
	tiles: Array<PuzzleTileInfo>
}

export type LevelConfig = {
	rows: number
	columns: number
	shuffleSteps: number
}

export type ImageInfo = {
	imageUrl: string
	width: number
	height: number
	ratio: number
}

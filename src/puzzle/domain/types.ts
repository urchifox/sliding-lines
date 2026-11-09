export type Position = {
	readonly row: number
	readonly column: number
}

export type PuzzleTileInfo = {
	readonly key: TileKey
	readonly originalPosition: Position
	readonly currentPosition: Position
	readonly isEmpty: boolean
}

export type PuzzleTilesArray = ReadonlyArray<PuzzleTileInfo>

export type TileKey = `${number}-${number}`

export type PuzzleData = {
	levelNumber: number
	level: Level
	imageInfo: ImageInfo
}

export type Level = LevelConfig & {
	tiles: PuzzleTilesArray
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

export type BoardState =
	| { isFinished: false; isUpdating: false }
	| { isFinished: true; isUpdating: boolean }

import type { LevelConfig } from "./game"

export const levels: Readonly<Array<Readonly<LevelConfig>>> = [
	{
		columns: 3,
		rows: 3,
		shuffleSteps: 3,
	},
	{
		columns: 4,
		rows: 4,
		shuffleSteps: 4,
	},
]

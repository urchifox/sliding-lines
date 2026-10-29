import { getLevelNumber } from "../../progress/user"
import { getImageInfo } from "./images"
import { createLevel } from "./level"
import type { PuzzleData } from "./types"

export async function createPuzzleData(): Promise<PuzzleData> {
	const levelNumber = getLevelNumber()
	const level = createLevel(levelNumber)
	const imageInfo = await getImageInfo(levelNumber)

	return { levelNumber, level, imageInfo }
}

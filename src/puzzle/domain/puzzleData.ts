import { selectLevelNumber } from "../../store/selectors"
import { getImageInfo } from "./images"
import { createLevel } from "./level"
import type { PuzzleData } from "./types"

export async function createPuzzleData(): Promise<PuzzleData> {
	const levelNumber = selectLevelNumber()
	const level = createLevel(levelNumber)
	const imageInfo = await getImageInfo(levelNumber)

	return { levelNumber, level, imageInfo }
}

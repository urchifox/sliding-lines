import { getImageInfo } from "./images"
import { createLevel } from "./level"
import type { PuzzleData } from "./types"

export async function createPuzzleData(
	levelNumber: number
): Promise<PuzzleData> {
	const level = createLevel(levelNumber)
	const imageInfo = await getImageInfo(levelNumber)

	return { level, imageInfo }
}

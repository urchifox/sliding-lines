import { getLevelNumber } from "./game"
import { getImageSize } from "./utils"

export type ImageInfo = {
	imageUrl: string
	width: number
	height: number
	ratio: number
}

const imagesNames = (function () {
	const pathStart = "/src/assets/images/puzzle-img-"
	const puzzleImages = import.meta.glob(
		`/src/assets/images/puzzle-img-*.{jpg,jpeg,png,webp}`,
		{ eager: true }
	)
	return Object.keys(puzzleImages).map((path) => path.replace(pathStart, ""))
})()

export async function getImageInfo(
	levelNumber: number = getLevelNumber()
): Promise<ImageInfo> {
	const imageNameIndex = levelNumber % imagesNames.length
	const imageName = imagesNames[imageNameIndex]
	const imageUrl = new URL(
		`/src/assets/images/puzzle-img-${imageName}`,
		import.meta.url
	).href

	let imageSizeInfo = await getImageSize(imageUrl)
	if (imageSizeInfo === null) {
		imageSizeInfo = {
			width: 1,
			height: 1,
			ratio: 1,
		}
	}

	return { imageUrl, ...imageSizeInfo }
}

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
	const allImages = import.meta.glob(`/src/assets/images/*`, {
		eager: true,
	})
	const allImagesPathes = Object.keys(allImages)
	const puzzleImages = allImagesPathes
		.filter((path) => path.startsWith(path))
		.map((path) => path.replace(pathStart, ""))
	return puzzleImages
})()

export async function getImageInfo(
	levelNumber: number = getLevelNumber()
): Promise<ImageInfo> {
	const imagesNumber = imagesNames.length
	const imageNameIndex =
		levelNumber === 0 ? 0 : (levelNumber % imagesNumber || imagesNumber) - 1
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

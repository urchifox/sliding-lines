export type ImageInfo = {
	imageUrl: string
	width: number
	height: number
	ratio: number
}

const imagesNames = (function () {
	const pathStart = "../../assets/images/puzzle-img-"
	const puzzleImages = import.meta.glob(
		"../../assets/images/puzzle-img-*.{jpg,jpeg,png,webp}",
		{ eager: true }
	)
	return Object.keys(puzzleImages)
		.sort((left, right) =>
			left.localeCompare(right, undefined, { numeric: true })
		)
		.map((path) => path.replace(pathStart, ""))
})()

export async function getImageInfo(levelNumber: number): Promise<ImageInfo> {
	const imageNameIndex = levelNumber % imagesNames.length
	const imageName = imagesNames[imageNameIndex]
	const imageUrl = new URL(
		`../../assets/images/puzzle-img-${imageName}`,
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

function getImageSize(
	url: string
): Promise<{ width: number; height: number; ratio: number } | null> {
	return new Promise((resolve) => {
		const img = new Image()
		img.onload = () => {
			resolve({
				width: img.naturalWidth,
				height: img.naturalHeight,
				ratio: img.naturalWidth / img.naturalHeight,
			})
		}
		img.onerror = () => {
			resolve(null)
		}
		img.src = url
	})
}

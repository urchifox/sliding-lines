export function randomInteger(min: number, max: number) {
	const rand = min + Math.random() * (max + 1 - min)
	return Math.floor(rand)
}

export function randomPick<Element>(
	array: Array<Element> | Readonly<Array<Element>>
): Element {
	return array[Math.floor(Math.random() * array.length)]
}

export function deleteFromArray<T>(array: T[], element: T) {
	const index = array.indexOf(element)
	if (index === -1) {
		return
	}
	array.splice(index, 1)
}

export function getImageSize(
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

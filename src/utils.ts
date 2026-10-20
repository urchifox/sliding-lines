export function getRandomNumber({
	min,
	max,
	step = 1,
}: {
	min: number
	max: number
	step?: number
}): number {
	if (step <= 0) {
		throw new Error("Step must be greater than 0")
	}

	if (max === min) {
		return min
	}

	if (max < min) {
		return getRandomNumber({ min: max, max: min, step })
	}

	const stepsCount = Math.floor((max - min) / step)
	return min + Math.floor(Math.random() * (stepsCount + 1)) * step
}

export function randomPick<Element>(
	array: Array<Element> | Readonly<Array<Element>>
): Element {
	return array[getRandomNumber({ min: 0, max: array.length - 1 })]
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

export function getUniqueValue<T>(occupiedSet: Set<T>, getter: () => T): T {
	let newValue = getter()

	while (occupiedSet.has(newValue)) {
		newValue = getter()
	}

	occupiedSet.add(newValue)

	return newValue
}

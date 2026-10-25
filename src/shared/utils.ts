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

	const decimals = Math.max(...[min, max, step].map(countDecimals))
	const factor = 10 ** decimals
	const scaledMin = Math.round(min * factor)
	const scaledMax = Math.round(max * factor)
	const scaledStep = Math.round(step * factor)

	const stepsCount = Math.floor((scaledMax - scaledMin) / scaledStep)
	const steps = Math.floor(Math.random() * (stepsCount + 1))
	return (scaledMin + steps * scaledStep) / factor
}

function countDecimals(value: number) {
	return (value.toString().split(".")[1] ?? "").length
}

export function pickRandomItem<Element>(
	array: Array<Element> | Readonly<Array<Element>>
): Element {
	if (array.length === 0) {
		throw new Error("Array is empty")
	}
	return array[getRandomNumber({ min: 0, max: array.length - 1 })]
}

export function deleteFromArray<T>(array: T[], element: T) {
	const index = array.indexOf(element)
	if (index === -1) {
		return
	}
	array.splice(index, 1)
}

export function getUniqueValue<T>(occupiedSet: Set<T>, getter: () => T): T {
	let newValue = getter()

	let tries = 0
	while (occupiedSet.has(newValue) && tries < 100) {
		newValue = getter()
		tries++
	}

	if (occupiedSet.has(newValue)) {
		throw new Error("Failed to get a unique value")
	}

	occupiedSet.add(newValue)

	return newValue
}

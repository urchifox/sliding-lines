import {
	deleteFromArray,
	getRandomNumber,
	getUniqueValue,
	pickRandomItem,
} from "./utils"

describe("utils", () => {
	let random: ReturnType<typeof vi.spyOn>

	beforeEach(() => {
		random = vi.spyOn(Math, "random")
	})

	describe("getRandomNumber", () => {
		it.each([
			{ min: 0, max: 3, expectedOneOf: [0, 1, 2, 3] },
			{ min: -1, max: 1, expectedOneOf: [-1, 0, 1] },
			{ min: -3, max: -1, expectedOneOf: [-3, -2, -1] },
			{ min: 0.5, max: 2, expectedOneOf: [0.5, 1.5] },
			{ min: 0, max: 3, step: 2, expectedOneOf: [0, 2] },
			{ min: 2, max: 3, step: 0.5, expectedOneOf: [2, 2.5, 3] },
			{ min: 0.1, max: 0.3, step: 0.1, expectedOneOf: [0.1, 0.2, 0.3] },
		])(
			"generates a random number between $min and $max according to step $step",
			({ min, max, step, expectedOneOf }) => {
				const randomNumber = getRandomNumber({
					min,
					max,
					step,
				})

				random.mockReturnValueOnce(0)
				const minRandomNumber = getRandomNumber({
					min,
					max,
					step,
				})

				random.mockReturnValueOnce(1 - Number.EPSILON)
				const maxRandomNumber = getRandomNumber({
					min,
					max,
					step,
				})

				expect(randomNumber).toBeOneOf(expectedOneOf)
				expect(minRandomNumber).toBe(expectedOneOf[0])
				expect(maxRandomNumber).toBe(expectedOneOf[expectedOneOf.length - 1])
			}
		)

		it.each([
			{ falseMin: 10, falseMax: 0 },
			{ falseMin: -10, falseMax: -20, step: 1 },
			{ falseMin: 0.1, falseMax: 0.01, step: 0.01 },
		])(
			"reorder max and min if max is less than min",
			({ falseMin, falseMax, step }) => {
				const randomNumber1 = getRandomNumber({
					min: falseMin,
					max: falseMax,
					step,
				})

				random.mockReturnValueOnce(0)
				const randomNumber2 = getRandomNumber({
					min: falseMin,
					max: falseMax,
					step,
				})

				random.mockReturnValueOnce(1 - Number.EPSILON)
				const randomNumber3 = getRandomNumber({
					min: falseMin,
					max: falseMax,
					step,
				})

				expect(randomNumber1).toBeGreaterThanOrEqual(falseMax)
				expect(randomNumber1).toBeLessThanOrEqual(falseMin)
				expect(randomNumber2).toBe(falseMax)
				expect(randomNumber3).toBe(falseMin)
			}
		)

		it.each([
			{ min: 1, max: 1 },
			{ min: -2, max: -2 },
			{ min: 2, max: 2, step: 0.5 },
			{ min: 2.5, max: 2.5, step: 2 },
		])("returns min if max is equal min", ({ min, max, step }) => {
			const randomNumber = getRandomNumber({ min, max, step })

			expect(randomNumber).toBe(min)
		})

		it.each([{ step: 0 }, { step: -0.5 }, { step: -1 }])(
			"throws an error if step is equal to or less than 0",
			({ step }) => {
				expect(() => getRandomNumber({ min: 0, max: 10, step })).toThrow()
			}
		)

		it.each([
			{ min: 0, max: 1, step: 5 },
			{ min: -10, max: -5, step: 10 },
			{ min: 0.1, max: 0.3, step: 0.5 },
		])("returns min if step is bigger than range", ({ min, max, step }) => {
			const randomNumber = getRandomNumber({ min, max, step })

			expect(randomNumber).toBe(min)
		})
	})

	describe("pickRandomItem", () => {
		it.each([
			{ array: [1] },
			{ array: [1, 3] },
			{ array: [10, 20, 30] },
			{ array: [4, 3, 2, 1] },
		])("returns a random item from the array", ({ array }) => {
			const randomItem = pickRandomItem(array)

			random.mockReturnValue(0)
			const firstRandomItem = pickRandomItem(array)

			random.mockReturnValue(1 - Number.EPSILON)
			const lastRandomItem = pickRandomItem(array)

			expect(randomItem).toBeOneOf(array)
			expect(firstRandomItem).toBe(array[0])
			expect(lastRandomItem).toBe(array[array.length - 1])
		})

		it("throws an error if the array is empty", () => {
			expect(() => pickRandomItem([])).toThrow("Array is empty")
		})
	})

	describe("deleteFromArray", () => {
		it.each([
			{ array: [1, 3], element: 1, expected: [3] },
			{ array: [10, 20, 30], element: 20, expected: [10, 30] },
			{ array: [3, 2, 1], element: 1, expected: [3, 2] },
		])("deletes the element from the array", ({ array, element, expected }) => {
			deleteFromArray(array, element)

			expect(array).toEqual(expected)
		})

		it("does nothing if the element is not in the array", () => {
			const array = [1, 3]
			deleteFromArray(array, 2)

			expect(array).toEqual([1, 3])
		})

		it("does nothing for empty array", () => {
			const array: number[] = []
			deleteFromArray(array, 1)

			expect(array).toEqual([])
		})
	})

	describe("getUniqueValue", () => {
		it.each([{ array: [] }, { array: [1, 3] }, { array: [3, 2, 1] }])(
			"returns a unique value from the array",
			({ array }) => {
				const occupiedSet = new Set(array)
				const getter = () => getRandomNumber({ min: 0, max: 4 })
				const value = getUniqueValue(occupiedSet, getter)

				expect(occupiedSet.has(value)).toBe(true)
				expect(array.includes(value)).toBe(false)
				expect(occupiedSet.size).toBe(array.length + 1)
			}
		)

		it("throws an error if impossible to get a unique value", () => {
			const occupiedSet = new Set([1, 2, 3])
			const getter = () => getRandomNumber({ min: 1, max: 3 })

			expect(() => getUniqueValue(occupiedSet, getter)).toThrow(
				"Failed to get a unique value"
			)
		})
	})
})

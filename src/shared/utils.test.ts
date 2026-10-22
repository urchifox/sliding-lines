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
			{ min: 0, max: 3, expected: [0, 1, 2, 3] },
			{ min: 2, max: 3, expected: [2, 3] },
			{ min: 0, max: 3, step: 2, expected: [0, 2] },
			{ min: 2, max: 3, step: 0.5, expected: [2, 2.5, 3] },
		])(
			"generates a random number between $min and $max according to step $step",
			({ min, max, step, expected }) => {
				const randomNumber = getRandomNumber({ min, max, step })

				expect(randomNumber).toBeOneOf(expected)
				expect(randomNumber).toBeGreaterThanOrEqual(min)
				expect(randomNumber).toBeLessThanOrEqual(max)
			}
		)

		it("reorder max and min if max is less than min", () => {
			const randomNumber = getRandomNumber({ min: 10, max: 0 })

			expect(randomNumber).toBeGreaterThanOrEqual(0)
			expect(randomNumber).toBeLessThanOrEqual(10)
		})

		it.each([
			{ min: 0, max: 3 },
			{ min: 2, max: 3 },
			{ min: 0, max: 3, step: 2 },
			{ min: 2, max: 3, step: 0.5 },
		])("returns min if max is equal min", ({ min, max, step }) => {
			random.mockReturnValue(0)

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
			{ min: 0, max: 3 },
			{ min: 2, max: 3 },
			{ min: 0, max: 3, step: 2 },
			{ min: 2, max: 3, step: 0.5 },
		])(
			"return min for randomization function that returns 0",
			({ min, max, step }) => {
				random.mockReturnValue(0)

				const randomNumber = getRandomNumber({ min, max, step })

				expect(randomNumber).toBe(min)
			}
		)

		it.each([
			{ min: 0, max: 3, expected: 3 },
			{ min: 2, max: 3, expected: 3 },
			{ min: 0, max: 3, step: 2, expected: 2 },
			{ min: 2, max: 3, step: 0.5, expected: 3 },
		])(
			"returns $expected for randomization function that returns 1 - Number.EPSILON",
			({ min, max, step, expected }) => {
				random.mockReturnValue(1 - Number.EPSILON)

				const randomNumber = getRandomNumber({ min, max, step })

				expect(randomNumber).toBe(expected)
			}
		)
	})

	describe("pickRandomItem", () => {
		it.each([{ array: [1, 3] }, { array: [10, 20, 30] }, { array: [3, 2, 1] }])(
			"returns a random item from the array",
			({ array }) => {
				const item = pickRandomItem(array)

				expect(item).toBeOneOf(array)
			}
		)

		it.each([
			{ array: [1, 3], expected: 1 },
			{ array: [10, 20, 30], expected: 10 },
			{ array: [3, 2, 1], expected: 3 },
		])(
			"returns first item from the array when randomization function returns 0",
			({ array, expected }) => {
				random.mockReturnValue(0)

				const item = pickRandomItem(array)

				expect(item).toBe(expected)
			}
		)

		it.each([
			{ array: [1, 3], expected: 3 },
			{ array: [10, 20, 30], expected: 30 },
			{ array: [3, 2, 1], expected: 1 },
		])(
			"returns last item from the array when randomization function returns 1 - Number.EPSILON",
			({ array, expected }) => {
				random.mockReturnValue(1 - Number.EPSILON)

				const item = pickRandomItem(array)

				expect(item).toBe(expected)
			}
		)
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

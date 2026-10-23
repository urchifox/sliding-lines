import { createLevel, resetLevel, shuffleLevel } from "./level"

describe("Level", () => {
	describe("createLevel", () => {
		it("creates a correct level with 0 difficulty", () => {
			const level = createLevel(0)
			const { tiles, columns, rows, shuffleSteps } = level

			expect(columns).toBe(3)
			expect(rows).toBe(3)
			expect(shuffleSteps).toBe(5)
			expect(tiles.length).toBe(9)
			const emptyTiles = tiles.filter((tile) => tile.isEmpty)
			expect(emptyTiles.length).toBe(1)
			expect(
				level.tiles.some(
					(tile) =>
						tile.currentPosition.row !== tile.originalPosition.row ||
						tile.currentPosition.column !== tile.originalPosition.column
				)
			).toBe(true)
		})

		it.each([1, 5, 9])(
			"creates a correct level with %i difficulty",
			(difficulty) => {
				const level = createLevel(difficulty)
				const { tiles, columns, rows, shuffleSteps } = level

				expect(columns).toBeGreaterThanOrEqual(3)
				expect(columns).toBeLessThanOrEqual(5)
				expect(rows).toBeGreaterThanOrEqual(3)
				expect(rows).toBeLessThanOrEqual(5)
				expect(shuffleSteps).toBeGreaterThanOrEqual(5)
				expect(shuffleSteps).toBeLessThanOrEqual(10)
				expect(tiles.length).toBeGreaterThanOrEqual(9)
				expect(tiles.length).toBeLessThanOrEqual(25)
				const emptyTiles = tiles.filter((tile) => tile.isEmpty)
				expect(emptyTiles.length).toBe(1)
				expect(
					level.tiles.some(
						(tile) =>
							tile.currentPosition.row !== tile.originalPosition.row ||
							tile.currentPosition.column !== tile.originalPosition.column
					)
				).toBe(true)
			}
		)

		it.each([10, 20, 100])(
			"creates a correct level with %i difficulty",
			(difficulty) => {
				const level = createLevel(difficulty)
				const { tiles, columns, rows, shuffleSteps } = level

				expect(columns).toBe(5)
				expect(rows).toBe(5)
				expect(shuffleSteps).toBe(10)
				expect(tiles.length).toBe(25)
				const emptyTiles = tiles.filter((tile) => tile.isEmpty)
				expect(emptyTiles.length).toBe(1)
				expect(
					level.tiles.some(
						(tile) =>
							tile.currentPosition.row !== tile.originalPosition.row ||
							tile.currentPosition.column !== tile.originalPosition.column
					)
				).toBe(true)
			}
		)
	})

	it("resets the level to the original state", () => {
		const level = createLevel(0)
		const { columns, rows, shuffleSteps, tiles } = level
		const initialTIlesCount = tiles.length
		const stringifiedTilesBeforeReset = JSON.stringify(tiles)

		resetLevel(level)
		const stringifiedTilesAfterReset = JSON.stringify(tiles)

		expect(stringifiedTilesBeforeReset).not.toBe(stringifiedTilesAfterReset)
		expect(
			tiles.every(
				(tile) =>
					tile.currentPosition.row === tile.originalPosition.row &&
					tile.currentPosition.column === tile.originalPosition.column
			)
		).toBe(true)
		expect(level.columns).toBe(columns)
		expect(level.rows).toBe(rows)
		expect(level.shuffleSteps).toBe(shuffleSteps)
		expect(tiles.length).toBe(initialTIlesCount)
	})

	it("shuffles the level", () => {
		const level = createLevel(0)
		resetLevel(level)
		const { tiles } = level
		const stringifiedTilesBeforeShuffle = JSON.stringify(tiles)

		shuffleLevel(level)

		const stringifiedTilesAfterShuffle = JSON.stringify(tiles)
		expect(stringifiedTilesBeforeShuffle).not.toBe(stringifiedTilesAfterShuffle)
		expect(
			level.tiles.some(
				(tile) =>
					tile.currentPosition.row !== tile.originalPosition.row ||
					tile.currentPosition.column !== tile.originalPosition.column
			)
		).toBe(true)
	})

	it("throws an error if no empty slot while shuffling", () => {
		const level = createLevel(0)
		const emptySlot = level.tiles.find((tile) => tile.isEmpty)
		if (emptySlot === undefined) {
			throw new Error("Empty slot not found")
		}
		emptySlot.isEmpty = false

		expect(() => shuffleLevel(level)).toThrow("Empty slot not found")
	})
})

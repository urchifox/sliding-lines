import { createLevel } from "./level"
import {
	createTileKey,
	createTiles,
	resetTiles,
	reshuffleTiles,
	shuffleTiles,
} from "./tiles"

describe("tiles", () => {
	describe("createTiles", () => {
		it.each([
			{ rows: 2, columns: 3, emptySlotIndex: 0 },
			{ rows: 3, columns: 3, emptySlotIndex: 4 },
			{ rows: 1, columns: 4, emptySlotIndex: 3 },
		])(
			"creates a solved board with the empty slot at index $emptySlotIndex",
			({ rows, columns, emptySlotIndex }) => {
				const tiles = createTiles(rows, columns, emptySlotIndex)

				expect(tiles).toHaveLength(rows * columns)
				tiles.forEach((tile, index) => {
					const row = Math.floor(index / columns) + 1
					const column = (index % columns) + 1

					expect(tile.key).toBe(createTileKey(row, column))
					expect(tile.originalPosition).toEqual({ row, column })
					expect(tile.currentPosition).toEqual({ row, column })
					expect(tile.isEmpty).toBe(index === emptySlotIndex)
				})
			}
		)
	})

	describe("createTileKey", () => {
		it.each([
			{ row: 1, column: 1, expected: "1-1" },
			{ row: 2, column: 3, expected: "2-3" },
			{ row: 10, column: 4, expected: "10-4" },
		])(
			"builds a key for row $row and column $column",
			({ row, column, expected }) => {
				expect(createTileKey(row, column)).toBe(expected)
			}
		)
	})

	it("resets tiles to the original positions", () => {
		const level = createLevel(0)
		const { tiles } = level
		const tilesBeforeReset = structuredClone(tiles)

		const resetedTiles = resetTiles(tiles)

		expect(tiles).toEqual(tilesBeforeReset)
		expect(resetedTiles).not.toEqual(tilesBeforeReset)
		expect(
			resetedTiles.every(
				(tile) =>
					tile.currentPosition.row === tile.originalPosition.row &&
					tile.currentPosition.column === tile.originalPosition.column
			)
		).toBe(true)
		expect(resetedTiles).toHaveLength(tiles.length)
	})

	it("shuffles tiles without changing the original board", () => {
		const random = vi.spyOn(Math, "random")
		random.mockReturnValue(0)
		const level = createLevel(0)
		const solvedTiles = resetTiles(level.tiles)
		const tilesBeforeShuffle = structuredClone(solvedTiles)
		random.mockReturnValue(0.5)

		const shuffledTiles = shuffleTiles({
			tiles: solvedTiles,
			shuffleSteps: level.shuffleSteps,
		})

		expect(solvedTiles).toEqual(tilesBeforeShuffle)
		expect(shuffledTiles).not.toEqual(tilesBeforeShuffle)
		expect(
			shuffledTiles.some(
				(tile) =>
					tile.currentPosition.row !== tile.originalPosition.row ||
					tile.currentPosition.column !== tile.originalPosition.column
			)
		).toBe(true)
	})

	it("reshuffles tiles without changing the original board", () => {
		const random = vi.spyOn(Math, "random")
		random.mockReturnValue(0)
		const level = createLevel(0)
		const { tiles, shuffleSteps } = level
		const tilesBeforeRestart = structuredClone(tiles)
		random.mockReturnValue(0.5)

		const reshuffledTiles = reshuffleTiles({ tiles, shuffleSteps })

		expect(tiles).toEqual(tilesBeforeRestart)
		expect(reshuffledTiles).not.toEqual(tilesBeforeRestart)
		expect(
			reshuffledTiles.some(
				(tile) =>
					tile.currentPosition.row !== tile.originalPosition.row ||
					tile.currentPosition.column !== tile.originalPosition.column
			)
		).toBe(true)
	})

	it("does not shuffle a solved board back to solved in two steps", () => {
		const solvedTiles = resetTiles(createLevel(0).tiles)

		for (let attempt = 0; attempt < 100; attempt++) {
			const shuffledTiles = shuffleTiles({
				tiles: solvedTiles,
				shuffleSteps: 2,
			})

			const isSolved = shuffledTiles.every(
				(tile) =>
					tile.currentPosition.row === tile.originalPosition.row &&
					tile.currentPosition.column === tile.originalPosition.column
			)
			expect(isSolved).toBe(false)
		}
	})

	it("throws an error if no empty slot while shuffling", () => {
		const tiles = createLevel(0).tiles.map((tile) => ({
			...tile,
			isEmpty: false,
		}))

		expect(() => shuffleTiles({ tiles, shuffleSteps: 1 })).toThrow(
			"Empty slot not found"
		)
	})
})

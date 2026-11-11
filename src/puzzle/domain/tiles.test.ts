import { createAlmostSolvedTiles } from "../../test/testHelpers"
import { createLevel } from "./level"
import {
	createTileKey,
	createTiles,
	getEmptyTile,
	getTileByCurrentPosition,
	getTileByKey,
	resetTiles,
	reshuffleTiles,
	shuffleTiles,
} from "./tiles"

describe("tiles", () => {
	describe("getTileByCurrentPosition", () => {
		it.each([
			{ position: { row: 1, column: 1 }, key: "1-3" },
			{ position: { row: 1, column: 2 }, key: "1-1" },
			{ position: { row: 2, column: 1 }, key: "2-1" },
		])(
			"returns the tile currently at row $position.row, column $position.column",
			({ position, key }) => {
				const tiles = createAlmostSolvedTiles()

				const tile = getTileByCurrentPosition(position, tiles)

				expect(tile?.key).toBe(key)
				expect(tile?.currentPosition).toEqual(position)
			}
		)

		it("matches the current position when it differs from the original position", () => {
			const tiles = createAlmostSolvedTiles()

			const tile = getTileByCurrentPosition({ row: 1, column: 1 }, tiles)

			expect(tile?.key).toBe("1-3")
			expect(tile?.originalPosition).toEqual({ row: 1, column: 3 })
		})

		it("returns undefined when no tile is at the position", () => {
			const tiles = createAlmostSolvedTiles()

			expect(
				getTileByCurrentPosition({ row: 4, column: 1 }, tiles)
			).toBeUndefined()
		})
	})

	describe("getTileByKey", () => {
		it.each([
			{ key: "1-3" as const, tileIndex: 0 },
			{ key: "1-1" as const, tileIndex: 1 },
			{ key: "3-3" as const, tileIndex: 8 },
		])("returns the tile with key $key", ({ key, tileIndex }) => {
			const tiles = createAlmostSolvedTiles()

			expect(getTileByKey(key, tiles)).toBe(tiles[tileIndex])
		})

		it("returns undefined when no tile has the key", () => {
			const tiles = createAlmostSolvedTiles()

			expect(getTileByKey("9-9", tiles)).toBeUndefined()
		})
	})

	describe("getEmptyTile", () => {
		it.each([
			{ rows: 2, columns: 3, emptySlotIndex: 0 },
			{ rows: 3, columns: 3, emptySlotIndex: 4 },
			{ rows: 1, columns: 4, emptySlotIndex: 3 },
		])(
			"returns the empty tile at index $emptySlotIndex",
			({ rows, columns, emptySlotIndex }) => {
				const tiles = createTiles(rows, columns, emptySlotIndex)

				expect(getEmptyTile(tiles)).toBe(tiles[emptySlotIndex])
			}
		)

		it("returns undefined when there is no empty tile", () => {
			const tiles = createAlmostSolvedTiles().map((tile) => ({
				...tile,
				isEmpty: false,
			}))

			expect(getEmptyTile(tiles)).toBeUndefined()
		})
	})

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

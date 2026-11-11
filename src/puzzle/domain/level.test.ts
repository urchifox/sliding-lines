import { createLevel } from "./level"

describe("Level", () => {
	describe("createLevel", () => {
		it.each([
			{
				difficulty: 0,
				expectedColumns: 3,
				expectedRows: 3,
				expectedShuffleSteps: 5,
			},
			{
				difficulty: 1,
				expectedColumns: 3,
				expectedRows: 3,
				expectedShuffleSteps: 6,
			},
			{
				difficulty: 5,
				expectedColumns: 4,
				expectedRows: 4,
				expectedShuffleSteps: 8,
			},
			{
				difficulty: 9,
				expectedColumns: 5,
				expectedRows: 5,
				expectedShuffleSteps: 10,
			},
			{
				difficulty: 10,
				expectedColumns: 5,
				expectedRows: 5,
				expectedShuffleSteps: 10,
			},
			{
				difficulty: 20,
				expectedColumns: 5,
				expectedRows: 5,
				expectedShuffleSteps: 10,
			},
			{
				difficulty: 100,
				expectedColumns: 5,
				expectedRows: 5,
				expectedShuffleSteps: 10,
			},
		])(
			"creates a correct level with $difficulty difficulty",
			({ difficulty, expectedColumns, expectedRows, expectedShuffleSteps }) => {
				const expectedTilesCount = expectedColumns * expectedRows

				const level = createLevel(difficulty)
				const { tiles, columns, rows, shuffleSteps } = level
				const emptyTiles = tiles.filter((tile) => tile.isEmpty)
				const originalPositions = tiles.map((tile) => tile.originalPosition)
				const originalPositionsStringified = originalPositions.map((position) =>
					JSON.stringify(position)
				)
				const currentPositions = tiles.map((tile) => tile.currentPosition)
				const currentPositionsStringified = currentPositions.map((position) =>
					JSON.stringify(position)
				)
				const keys = tiles.map((tile) => tile.key)

				expect(columns).toBe(expectedColumns)
				expect(rows).toBe(expectedRows)
				expect(shuffleSteps).toBe(expectedShuffleSteps)
				expect(tiles.length).toBe(expectedTilesCount)
				expect(new Set(originalPositionsStringified).size).toBe(
					expectedTilesCount
				)
				expect(new Set(currentPositionsStringified).size).toBe(
					expectedTilesCount
				)
				expect(new Set(keys).size).toBe(expectedTilesCount)
				expect(emptyTiles.length).toBe(1)
				expect(
					tiles.some(
						(tile) =>
							tile.currentPosition.row !== tile.originalPosition.row ||
							tile.currentPosition.column !== tile.originalPosition.column
					)
				).toBe(true)
				expect(
					originalPositions.every(
						(position) =>
							position.row >= 1 &&
							position.row <= expectedRows &&
							position.column >= 1 &&
							position.column <= expectedColumns
					)
				).toBe(true)
				expect(
					currentPositions.every(
						(position) =>
							position.row >= 1 &&
							position.row <= expectedRows &&
							position.column >= 1 &&
							position.column <= expectedColumns
					)
				).toBe(true)
			}
		)

		it("creates a correct level with negative level number", () => {
			const levelForNegativeValue = createLevel(-100)
			const { tiles: _tiles1, ...levelForNegativeValueWithoutTiles } =
				levelForNegativeValue
			const levelForZero = createLevel(0)
			const { tiles: _tiles2, ...levelForZeroWithoutTiles } = levelForZero

			expect(levelForNegativeValueWithoutTiles).toEqual(
				levelForZeroWithoutTiles
			)
		})
	})
})

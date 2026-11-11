import { createAlmostSolvedTiles, createTile } from "../../test/testHelpers"
import { createTiles } from "../domain/tiles"
import type { PuzzleTilesArray, TileKey } from "../domain/types"
import { handleRovingTabindex } from "./handleRovingTabindex"

function moveFocus({
	tiles,
	tileKey,
	arrowKey,
	rows = 3,
	columns = 3,
	emptyRow = rows,
	emptyColumn = columns,
}: {
	tiles?: PuzzleTilesArray
	tileKey: TileKey
	arrowKey: string
	rows?: number
	columns?: number
	emptyRow?: number
	emptyColumn?: number
}) {
	const board =
		tiles ??
		createTiles(rows, columns, (emptyRow - 1) * columns + (emptyColumn - 1))

	return handleRovingTabindex({
		tiles: board,
		tileKey,
		arrowKey,
		rows,
		columns,
	})
}

describe("handleRovingTabindex", () => {
	it.each(["Enter", "Tab", "a", "Arrowleft", ""])(
		"returns null for the non-arrow key $arrowKey",
		(arrowKey) => {
			expect(
				moveFocus({
					tiles: createAlmostSolvedTiles(),
					tileKey: "2-2",
					arrowKey,
				})
			).toBeNull()
		}
	)

	it("returns null when the focused tile is not on the board", () => {
		expect(
			moveFocus({
				tiles: createAlmostSolvedTiles(),
				tileKey: "9-9",
				arrowKey: "ArrowRight",
			})
		).toBeNull()
	})

	describe("moves between neighboring tiles", () => {
		it.each([
			{ tileKey: "1-1" as const, arrowKey: "ArrowRight", expected: "1-2" },
			{ tileKey: "1-2" as const, arrowKey: "ArrowLeft", expected: "1-1" },
			{ tileKey: "1-1" as const, arrowKey: "ArrowDown", expected: "2-1" },
			{ tileKey: "2-1" as const, arrowKey: "ArrowUp", expected: "1-1" },
			{ tileKey: "2-2" as const, arrowKey: "ArrowRight", expected: "2-3" },
			{ tileKey: "2-3" as const, arrowKey: "ArrowUp", expected: "1-3" },
			{
				tileKey: "1-3" as const,
				arrowKey: "ArrowRight",
				expected: "1-4",
				rows: 2,
				columns: 4,
			},
		])(
			"moves $arrowKey from $tileKey to $expected",
			({ tileKey, arrowKey, expected, rows, columns }) => {
				expect(moveFocus({ tileKey, arrowKey, rows, columns })).toBe(expected)
			}
		)
	})

	describe("stops at the edge", () => {
		it.each([
			{ tileKey: "1-1" as const, arrowKey: "ArrowLeft" },
			{ tileKey: "1-1" as const, arrowKey: "ArrowUp" },
			{ tileKey: "1-3" as const, arrowKey: "ArrowRight" },
			{ tileKey: "3-1" as const, arrowKey: "ArrowDown" },
			{ tileKey: "3-2" as const, arrowKey: "ArrowDown" },
			{ tileKey: "2-3" as const, arrowKey: "ArrowRight" },
			{ tileKey: "1-4" as const, arrowKey: "ArrowRight", rows: 2, columns: 4 },
			{ tileKey: "2-1" as const, arrowKey: "ArrowDown", rows: 2, columns: 4 },
		])(
			"returns null when $arrowKey from $tileKey stays on the same tile",
			({ tileKey, arrowKey, rows, columns }) => {
				expect(moveFocus({ tileKey, arrowKey, rows, columns })).toBeNull()
			}
		)
	})

	describe("empty tiles", () => {
		it.each([
			{ tileKey: "1-2" as const, arrowKey: "ArrowDown", expected: "3-2" },
			{ tileKey: "3-2" as const, arrowKey: "ArrowUp", expected: "1-2" },
			{ tileKey: "2-1" as const, arrowKey: "ArrowRight", expected: "2-3" },
			{ tileKey: "2-3" as const, arrowKey: "ArrowLeft", expected: "2-1" },
		])(
			"skips the empty tile when moving $arrowKey from $tileKey",
			({ tileKey, arrowKey, expected }) => {
				expect(
					moveFocus({ tileKey, arrowKey, emptyRow: 2, emptyColumn: 2 })
				).toBe(expected)
			}
		)

		it.each([
			{
				emptyRow: 1,
				emptyColumn: 3,
				tileKey: "1-2" as const,
				arrowKey: "ArrowRight",
			},
			{
				emptyRow: 1,
				emptyColumn: 1,
				tileKey: "1-2" as const,
				arrowKey: "ArrowLeft",
			},
			{
				emptyRow: 3,
				emptyColumn: 2,
				tileKey: "2-2" as const,
				arrowKey: "ArrowDown",
			},
			{
				emptyRow: 2,
				emptyColumn: 1,
				tileKey: "2-2" as const,
				arrowKey: "ArrowLeft",
			},
		])(
			"returns null when $arrowKey from $tileKey would pass the empty edge tile at row $emptyRow, column $emptyColumn",
			({ emptyRow, emptyColumn, tileKey, arrowKey }) => {
				expect(
					moveFocus({ tileKey, arrowKey, emptyRow, emptyColumn })
				).toBeNull()
			}
		)

		it("skips only the first empty tile", () => {
			const tiles = [
				createTile({ originalRow: 1, originalColumn: 1 }),
				createTile({ originalRow: 1, originalColumn: 2, isEmpty: true }),
				createTile({ originalRow: 1, originalColumn: 3, isEmpty: true }),
				createTile({ originalRow: 1, originalColumn: 4 }),
			]

			expect(
				moveFocus({
					tiles,
					tileKey: "1-1",
					arrowKey: "ArrowRight",
					rows: 1,
					columns: 4,
				})
			).toBe("1-3")
		})

		it.each([
			{
				situation: "the cell past the empty tile is vacant",
				tiles: [
					createTile({ originalRow: 1, originalColumn: 1 }),
					createTile({ originalRow: 1, originalColumn: 2, isEmpty: true }),
				],
			},
			{
				situation: "the neighboring cell is vacant",
				tiles: [createTile({ originalRow: 1, originalColumn: 1 })],
			},
		])("returns null when $situation", ({ tiles }) => {
			expect(
				moveFocus({
					tiles,
					tileKey: "1-1",
					arrowKey: "ArrowRight",
					rows: 1,
					columns: 3,
				})
			).toBeNull()
		})
	})

	describe("current position", () => {
		it.each([
			{ tileKey: "1-1" as const, arrowKey: "ArrowRight", expected: "1-2" },
			{ tileKey: "1-2" as const, arrowKey: "ArrowLeft", expected: "1-1" },
		])(
			"uses the current position when moving $arrowKey from $tileKey",
			({ tileKey, arrowKey, expected }) => {
				expect(
					moveFocus({
						tiles: createAlmostSolvedTiles(),
						tileKey,
						arrowKey,
					})
				).toBe(expected)
			}
		)
	})
})

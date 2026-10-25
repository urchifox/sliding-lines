// @vitest-environment happy-dom
import { getLevelNumber } from "../../progress/user"
import { getCurrentNeighborsOf, swap, tryMove } from "./game"
import type { PuzzleTileInfo } from "./types"

function getTiles() {
	return [
		{
			key: "1-3",
			originalPosition: {
				row: 1,
				column: 3,
			},
			currentPosition: {
				row: 1,
				column: 1,
			},
			isEmpty: true,
		},
		{
			key: "1-1",
			originalPosition: {
				row: 1,
				column: 1,
			},
			currentPosition: {
				row: 1,
				column: 2,
			},
			isEmpty: false,
		},
		{
			key: "1-2",
			originalPosition: {
				row: 1,
				column: 2,
			},
			currentPosition: {
				row: 1,
				column: 3,
			},
			isEmpty: false,
		},
		{
			key: "2-1",
			originalPosition: {
				row: 2,
				column: 1,
			},
			currentPosition: {
				row: 2,
				column: 1,
			},
			isEmpty: false,
		},
		{
			key: "2-2",
			originalPosition: {
				row: 2,
				column: 2,
			},
			currentPosition: {
				row: 2,
				column: 2,
			},
			isEmpty: false,
		},
		{
			key: "2-3",
			originalPosition: {
				row: 2,
				column: 3,
			},
			currentPosition: {
				row: 2,
				column: 3,
			},
			isEmpty: false,
		},
		{
			key: "3-1",
			originalPosition: {
				row: 3,
				column: 1,
			},
			currentPosition: {
				row: 3,
				column: 1,
			},
			isEmpty: false,
		},
		{
			key: "3-2",
			originalPosition: {
				row: 3,
				column: 2,
			},
			currentPosition: {
				row: 3,
				column: 2,
			},
			isEmpty: false,
		},
		{
			key: "3-3",
			originalPosition: {
				row: 3,
				column: 3,
			},
			currentPosition: {
				row: 3,
				column: 3,
			},
			isEmpty: false,
		},
	] satisfies Array<PuzzleTileInfo>
}

describe("game", () => {
	it.each([
		{
			position: { row: 1, column: 1 },
			expectedNeighborsIndexes: [1, 3],
		},
		{
			position: { row: 1, column: 2 },
			expectedNeighborsIndexes: [0, 2, 4],
		},
		{
			position: { row: 2, column: 2 },
			expectedNeighborsIndexes: [1, 3, 5, 7],
		},
		{
			position: { row: 4, column: 1 },
			expectedNeighborsIndexes: [6],
		},
		{
			position: { row: 4, column: 4 },
			expectedNeighborsIndexes: [],
		},
	])(
		"finds side neighbors of position $position",
		({ position, expectedNeighborsIndexes }) => {
			const tiles = getTiles()
			const expectedTiles = expectedNeighborsIndexes.map(
				(index) => tiles[index]
			)

			const neighbors = getCurrentNeighborsOf(position, tiles)

			expect(new Set(neighbors)).toEqual(new Set(expectedTiles))
		}
	)

	describe("swap", () => {
		function getTileStaticInfoStringified(tile: PuzzleTileInfo) {
			const { currentPosition, ...rest } = tile
			return JSON.stringify(rest)
		}

		it("changes only current positions of tiles when swapping two different tiles", () => {
			const tiles = getTiles()
			const tile1 = tiles[1]
			const tile1StringifiedCurrentPosition = JSON.stringify(
				tile1.currentPosition
			)
			const tile1RestStringified = getTileStaticInfoStringified(tile1)
			const tile2 = tiles[2]
			const tile2StringifiedCurrentPosition = JSON.stringify(
				tile2.currentPosition
			)
			const tile2RestStringified = getTileStaticInfoStringified(tile2)

			swap({ tile1, tile2 })

			expect(tile1.currentPosition).toEqual(
				JSON.parse(tile2StringifiedCurrentPosition)
			)
			expect(tile2.currentPosition).toEqual(
				JSON.parse(tile1StringifiedCurrentPosition)
			)
			expect(getTileStaticInfoStringified(tile1)).toEqual(tile1RestStringified)
			expect(getTileStaticInfoStringified(tile2)).toEqual(tile2RestStringified)
		})

		it("changes nothing when swaps same tile", () => {
			const tiles = getTiles()
			const tile = tiles[1]
			const tileStringified = JSON.stringify(tile)

			swap({ tile1: tile, tile2: tile })

			expect(tile).toEqual(JSON.parse(tileStringified))
		})
	})

	describe("tryMove", () => {
		it("attempt to move empty tile makes nothing", () => {
			const tiles = getTiles()
			const stringifiedTiles = JSON.stringify(tiles)
			const emptySlot = tiles[0]

			const { isSolved, updatedTiles } = tryMove(emptySlot, tiles)

			expect(isSolved).toBe(false)
			expect(updatedTiles).toBeNull()
			expect(tiles).toEqual(JSON.parse(stringifiedTiles))
		})

		it("attempt on move tile without empty tile as neighbour makes nothing", () => {
			const tiles = getTiles()
			const stringifiedTiles = JSON.stringify(tiles)
			const tile = tiles[8]

			const { isSolved, updatedTiles } = tryMove(tile, tiles)

			expect(isSolved).toBe(false)
			expect(updatedTiles).toBeNull()
			expect(tiles).toEqual(JSON.parse(stringifiedTiles))
		})

		it("moves tile with  empty tile as neighbour", () => {
			const tiles = getTiles()
			const [emptySlot, tile, ...otherTiles] = tiles
			const stringifiedOtherTiles = JSON.stringify(otherTiles)
			const emptySlotStringifiedPosition = JSON.stringify(
				emptySlot.currentPosition
			)
			const tileStringifiedPosition = JSON.stringify(tile.currentPosition)
			const initialLevel = getLevelNumber()

			const { isSolved, updatedTiles } = tryMove(tile, tiles)

			expect(isSolved).toBe(false)
			expect(getLevelNumber()).toBe(initialLevel)
			expect(new Set(updatedTiles as Array<PuzzleTileInfo>)).toEqual(
				new Set([emptySlot, tile])
			)
			expect(emptySlot.currentPosition).toEqual(
				JSON.parse(tileStringifiedPosition)
			)
			expect(tile.currentPosition).toEqual(
				JSON.parse(emptySlotStringifiedPosition)
			)
			expect(emptySlot.isEmpty).toBe(true)
			expect(tile.isEmpty).toBe(false)
			expect(otherTiles).toEqual(JSON.parse(stringifiedOtherTiles))
		})

		it("completes level when all tiles on original positions", () => {
			const tiles = getTiles()
			const [emptySlot, tile1, tile2, ...otherTiles] = tiles
			const stringifiedOtherTiles = JSON.stringify(otherTiles)
			const initialLevel = getLevelNumber()

			const result1 = tryMove(tile1, tiles)
			const result2 = tryMove(tile2, tiles)

			expect(result1.isSolved).toBe(false)
			expect(result2.isSolved).toBe(true)
			expect(getLevelNumber()).toBe(initialLevel + 1)
			expect(new Set(result1.updatedTiles as Array<PuzzleTileInfo>)).toEqual(
				new Set([emptySlot, tile1])
			)
			expect(new Set(result2.updatedTiles as Array<PuzzleTileInfo>)).toEqual(
				new Set([emptySlot, tile2])
			)
			expect(emptySlot.currentPosition).toEqual(emptySlot.originalPosition)
			expect(tile1.currentPosition).toEqual(tile1.originalPosition)
			expect(tile2.currentPosition).toEqual(tile2.originalPosition)
			expect(emptySlot.isEmpty).toBe(true)
			expect(tile1.isEmpty).toBe(false)
			expect(tile2.isEmpty).toBe(false)
			expect(otherTiles).toEqual(JSON.parse(stringifiedOtherTiles))
		})
	})
})

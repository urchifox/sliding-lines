import { createAlmostSolvedTiles, createTile } from "../../test/testHelpers"
import { getCurrentNeighborsOf, swap, tryMove } from "./game"
import type { PuzzleTileInfo } from "./types"

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
			const tiles = createAlmostSolvedTiles()
			const expectedTiles = expectedNeighborsIndexes.map(
				(index) => tiles[index]
			)

			const neighbors = getCurrentNeighborsOf(position, tiles)

			expect(new Set(neighbors)).toEqual(new Set(expectedTiles))
		}
	)

	describe("swap", () => {
		function getTileStaticInfo(tile: PuzzleTileInfo) {
			const { currentPosition, ...rest } = tile
			return structuredClone(rest)
		}

		it("changes only current positions of tiles when swapping two different tiles", () => {
			const tiles = createAlmostSolvedTiles()
			const tile1 = tiles[1]
			const tile1CurrentPosition = structuredClone(tile1.currentPosition)
			const tile1Rest = getTileStaticInfo(tile1)
			const tile2 = tiles[2]
			const tile2CurrentPosition = structuredClone(tile2.currentPosition)
			const tile2Rest = getTileStaticInfo(tile2)

			const [newTile1, newTile2] = swap({ tile1, tile2 })

			expect(tile1.currentPosition).toEqual(tile1CurrentPosition)
			expect(tile2.currentPosition).toEqual(tile2CurrentPosition)
			expect(newTile1.currentPosition).toEqual(tile2CurrentPosition)
			expect(newTile2.currentPosition).toEqual(tile1CurrentPosition)
			expect(getTileStaticInfo(newTile1)).toEqual(tile1Rest)
			expect(getTileStaticInfo(newTile2)).toEqual(tile2Rest)
		})

		it("changes nothing when swaps same tile", () => {
			const tiles = createAlmostSolvedTiles()
			const tile = tiles[1]
			const tileClone = structuredClone(tile)

			swap({ tile1: tile, tile2: tile })

			expect(tile).toEqual(tileClone)
		})
	})

	describe("tryMove", () => {
		it("attempt to move empty tile makes nothing", () => {
			const tiles = createAlmostSolvedTiles()
			const tilesClone = structuredClone(tiles)
			const emptySlot = tiles[0]

			const updatedTiles = tryMove(emptySlot, tiles)

			expect(updatedTiles).toBeNull()
			expect(tiles).toEqual(tilesClone)
		})

		it("rejects an empty tile even when another empty tile is adjacent", () => {
			const emptySlot = createTile({
				originalRow: 1,
				originalColumn: 1,
				isEmpty: true,
			})
			const otherEmpty = createTile({
				originalRow: 1,
				originalColumn: 2,
				isEmpty: true,
			})
			const tiles = [emptySlot, otherEmpty]
			const tilesClone = structuredClone(tiles)

			const updatedTiles = tryMove(emptySlot, tiles)

			expect(updatedTiles).toBeNull()
			expect(tiles).toEqual(tilesClone)
		})

		it.each([
			{ tileIndex: 2 },
			{ tileIndex: 4 },
			{ tileIndex: 6 },
			{ tileIndex: 8 },
		])(
			"attempt on move tile without empty tile as neighbour makes nothing",
			({ tileIndex }) => {
				const tiles = createAlmostSolvedTiles()
				const tilesClone = structuredClone(tiles)
				const tile = tiles[tileIndex]

				const updatedTiles = tryMove(tile, tiles)

				expect(updatedTiles).toBeNull()
				expect(tiles).toEqual(tilesClone)
			}
		)

		it("moves tile with empty tile as neighbour", () => {
			const tiles = createAlmostSolvedTiles()
			const tilesClone = structuredClone(tiles)
			const [emptySlot, tile, ...otherTiles] = tiles
			const emptySlotPosition = structuredClone(emptySlot.currentPosition)
			const tilePosition = structuredClone(tile.currentPosition)

			const updatedTiles = tryMove(tile, tiles)

			expect(tiles).toEqual(tilesClone)
			expect(updatedTiles).toEqual([
				{ ...emptySlot, currentPosition: tilePosition },
				{ ...tile, currentPosition: emptySlotPosition },
				...otherTiles,
			])
		})
	})
})

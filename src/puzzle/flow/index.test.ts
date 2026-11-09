import { upgradeLevel } from "../../progress/user"
import { createTile } from "../../test/testHelpers"
import { isPuzzleSolved, tryMove } from "../domain/game"
import { handleTryMove } from "./index"

vi.mock("../../progress/user", () => ({
	upgradeLevel: vi.fn(),
}))

vi.mock("../domain/game", () => ({
	tryMove: vi.fn(),
	isPuzzleSolved: vi.fn(),
}))

const mockedTryMove = vi.mocked(tryMove)
const mockedIsPuzzleSolved = vi.mocked(isPuzzleSolved)
const mockedUpgradeLevel = vi.mocked(upgradeLevel)

const tile = createTile({ originalRow: 1, originalColumn: 1 })
const tiles = [tile]
const updatedTiles = [tile]

beforeEach(() => {
	vi.resetAllMocks()
})

describe("handleTryMove", () => {
	it("returns the same tiles when the move is rejected", () => {
		const onSolved = vi.fn()
		mockedTryMove.mockReturnValue(null)

		const result = handleTryMove({ tile, tiles, onSolved })

		expect(result).toBe(tiles)
		expect(mockedTryMove).toHaveBeenCalledWith(tile, tiles)
		expect(mockedIsPuzzleSolved).not.toHaveBeenCalled()
		expect(mockedUpgradeLevel).not.toHaveBeenCalled()
		expect(onSolved).not.toHaveBeenCalled()
	})

	it("returns the next tiles when the move leaves the puzzle unsolved", () => {
		const onSolved = vi.fn()
		mockedTryMove.mockReturnValue(updatedTiles)
		mockedIsPuzzleSolved.mockReturnValue(false)

		const result = handleTryMove({ tile, tiles, onSolved })

		expect(result).toBe(updatedTiles)
		expect(mockedTryMove).toHaveBeenCalledWith(tile, tiles)
		expect(mockedIsPuzzleSolved).toHaveBeenCalledWith(tiles)
		expect(onSolved).not.toHaveBeenCalled()
		expect(mockedUpgradeLevel).not.toHaveBeenCalled()
	})

	it("upgrades the level when the move solves the puzzle", () => {
		const onSolved = vi.fn()
		mockedTryMove.mockReturnValue(updatedTiles)
		mockedIsPuzzleSolved.mockReturnValue(true)

		const result = handleTryMove({ tile, tiles, onSolved })

		expect(result).toBe(updatedTiles)
		expect(mockedTryMove).toHaveBeenCalledWith(tile, tiles)
		expect(mockedIsPuzzleSolved).toHaveBeenCalledWith(tiles)
		expect(mockedUpgradeLevel).toHaveBeenCalledOnce()
		expect(onSolved).toHaveBeenCalledOnce()
	})

	it("works when callbacks are omitted", () => {
		mockedTryMove.mockReturnValue(null)
		expect(handleTryMove({ tile, tiles })).toBe(tiles)

		mockedTryMove.mockReturnValue(updatedTiles)
		mockedIsPuzzleSolved.mockReturnValue(true)
		expect(handleTryMove({ tile, tiles })).toBe(updatedTiles)

		expect(mockedUpgradeLevel).toHaveBeenCalledOnce()
	})
})

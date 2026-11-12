import { store } from "../../store"
import { upgradeLevel } from "../../store/progressSlice"
import { createTile } from "../../test/testHelpers"
import { isPuzzleSolved, tryMove } from "../domain/game"
import { handleTryMove } from "./handleTryMove"

vi.mock("../../progress/user", () => ({
	upgradeLevel: vi.fn(),
}))

vi.mock("../domain/game", () => ({
	tryMove: vi.fn(),
	isPuzzleSolved: vi.fn(),
}))

const mockedTryMove = vi.mocked(tryMove)
const mockedIsPuzzleSolved = vi.mocked(isPuzzleSolved)
const dispatchSpy = vi.spyOn(store, "dispatch")

const tile = createTile({ originalRow: 1, originalColumn: 1 })
const tiles = [tile]
const updatedTiles = [tile]

beforeEach(() => {
	vi.resetAllMocks()
	dispatchSpy.mockClear()
})

afterAll(() => {
	dispatchSpy.mockRestore()
})

describe("handleTryMove", () => {
	it("returns the same tiles when the move is rejected", () => {
		const onSolved = vi.fn()
		mockedTryMove.mockReturnValue(null)

		const result = handleTryMove({ tile, tiles, onSolved })

		expect(result).toBe(tiles)
		expect(mockedTryMove).toHaveBeenCalledWith(tile, tiles)
		expect(mockedIsPuzzleSolved).not.toHaveBeenCalled()
		expect(dispatchSpy).not.toHaveBeenCalledWith(upgradeLevel())
		expect(onSolved).not.toHaveBeenCalled()
	})

	it("returns the next tiles when the move leaves the puzzle unsolved", () => {
		const onSolved = vi.fn()
		mockedTryMove.mockReturnValue(updatedTiles)
		mockedIsPuzzleSolved.mockReturnValue(false)

		const result = handleTryMove({ tile, tiles, onSolved })

		expect(result).toBe(updatedTiles)
		expect(mockedTryMove).toHaveBeenCalledWith(tile, tiles)
		expect(mockedIsPuzzleSolved).toHaveBeenCalledWith(updatedTiles)
		expect(onSolved).not.toHaveBeenCalled()
		expect(dispatchSpy).not.toHaveBeenCalledWith(upgradeLevel())
	})

	it("upgrades the level when the move solves the puzzle", () => {
		const onSolved = vi.fn()
		mockedTryMove.mockReturnValue(updatedTiles)
		mockedIsPuzzleSolved.mockReturnValue(true)

		const result = handleTryMove({ tile, tiles, onSolved })

		expect(result).toBe(updatedTiles)
		expect(mockedTryMove).toHaveBeenCalledWith(tile, tiles)
		expect(mockedIsPuzzleSolved).toHaveBeenCalledWith(updatedTiles)
		expect(dispatchSpy).not.toHaveBeenCalledWith(upgradeLevel())
		expect(onSolved).toHaveBeenCalledOnce()
	})

	it("works when callbacks are omitted", () => {
		mockedTryMove.mockReturnValue(null)
		expect(handleTryMove({ tile, tiles })).toBe(tiles)

		mockedTryMove.mockReturnValue(updatedTiles)
		mockedIsPuzzleSolved.mockReturnValue(true)
		expect(handleTryMove({ tile, tiles })).toBe(updatedTiles)

		expect(dispatchSpy).not.toHaveBeenCalledWith(upgradeLevel())
	})
})

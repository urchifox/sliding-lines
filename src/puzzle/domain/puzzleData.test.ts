import { getImageInfo } from "./images"
import { createLevel } from "./level"
import { createPuzzleData } from "./puzzleData"

vi.mock("./images", () => ({
	getImageInfo: vi.fn(),
}))

vi.mock("./level", () => ({
	createLevel: vi.fn(),
}))

describe("createPuzzleData", () => {
	const mockedGetImageInfo = vi.mocked(getImageInfo)
	const mockedCreateLevel = vi.mocked(createLevel)

	beforeEach(() => {
		vi.resetAllMocks()
	})

	it("creates a puzzle with full info for current level", async () => {
		const mockedImageInfo = {
			imageUrl: "test-image.jpg",
			width: 100,
			height: 100,
			ratio: 1,
		}
		mockedGetImageInfo.mockResolvedValue(mockedImageInfo)
		const mockedLevel = { rows: 3, columns: 3, shuffleSteps: 1, tiles: [] }
		mockedCreateLevel.mockReturnValue(mockedLevel)

		const puzzle = await createPuzzleData(5)

		expect(mockedCreateLevel).toHaveBeenCalledWith(5)
		expect(mockedGetImageInfo).toHaveBeenCalledWith(5)
		expect(puzzle.imageInfo).toEqual(mockedImageInfo)
		expect(puzzle.level).toEqual(mockedLevel)
	})
})

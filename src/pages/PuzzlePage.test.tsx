// @vitest-environment happy-dom
import { act, fireEvent, render, screen } from "@testing-library/react"
import { StrictMode } from "react"

import { restartLevel } from "../puzzle/domain/level"
import { createPuzzleData } from "../puzzle/domain/puzzleData"
import type {
	BoardState,
	PuzzleData,
	PuzzleTileInfo,
	TileKey,
} from "../puzzle/domain/types"
import {
	createDeferred,
	expectTileBeingMovedAt,
	getPuzzleBoard,
	getTileButton,
	getTileElement,
	createAlmostSolvedTiles,
	queryPuzzleBoard,
} from "../test/testHelpers"
import { PuzzlePage } from "./PuzzlePage"
import { getLevelNumber } from "../progress/user"

vi.mock("../puzzle/domain/puzzleData", () => ({
	createPuzzleData: vi.fn(),
}))

vi.mock("../puzzle/domain/level", () => ({
	restartLevel: vi.fn(),
}))


const mockedCreatePuzzleData = vi.mocked(createPuzzleData)
const mockedRestartLevel = vi.mocked(restartLevel)

const loadingText = "Loading…"
const errorText = "An error occurred, try to reload the page"

function getLoadingMessage() {
	return screen.getByText(loadingText)
}

function queryLoadingMessage() {
	return screen.queryByText(loadingText)
}

function findErrorMessage() {
	return screen.findByText(errorText)
}

function getMockedPuzzleData(): PuzzleData {
	return {
		levelNumber: 0,
		level: { rows: 3, columns: 3, shuffleSteps: 1, tiles: createAlmostSolvedTiles() },
		imageInfo: {
			imageUrl: "test-image.jpg",
			width: 300,
			height: 200,
			ratio: 1.5,
		},
	}
}

function expectPageChrome(state: BoardState, levelText = "Level 1") {
	const puzzleBoard = getPuzzleBoard()
	const levelName = screen.getByText(levelText)
	const restartButton = screen.getByRole("button", { name: "Restart" })
	const winHeader = screen.getByText("You have won!")
	const playButton = screen.getByText("Solve next puzzle")

	if (state.isFinished) {
		expect(puzzleBoard).toHaveStyle({ backgroundColor: "transparent" })
	} else {
		expect(puzzleBoard).not.toHaveStyle({ backgroundColor: "transparent" })
	}
	expect(puzzleBoard).toHaveStyle({ "--image": "url(test-image.jpg)" })
	expect(levelName).toHaveStyle({ opacity: state.isUpdating ? 0 : 1 })
	expect(restartButton).toHaveStyle({ opacity: state.isFinished ? 0 : 1 })
	expect(winHeader).toHaveStyle({
		display: state.isFinished ? "block" : "none",
	})
	expect(winHeader).toHaveStyle({
		"--animation-name": state.isUpdating
			? "slide-out-to-right"
			: state.isFinished
				? "slide-in-from-left"
				: "none",
	})
	expect(playButton).toHaveStyle({
		display: state.isFinished ? "block" : "none",
	})
	expect(playButton).toHaveStyle({
		"--animation-name": state.isUpdating
			? "slide-out-to-left"
			: state.isFinished
				? "slide-in-from-right"
				: "none",
	})
	if (state.isFinished) {
		expect(restartButton).toBeDisabled()
	} else {
		expect(restartButton).toBeEnabled()
	}
	if (state.isUpdating) {
		expect(playButton).toBeDisabled()
	} else {
		expect(playButton).toBeEnabled()
	}
}

async function renderPuzzlePage() {
	const renderResult = render(<PuzzlePage />)
	await screen.findByText("Level 1")
	return renderResult
}

function clickTile(key: TileKey) {
	const tileElement = getTileElement(key)
	const tile = createAlmostSolvedTiles().find((item) => item.key === key) as PuzzleTileInfo
	const tileButton = getTileButton(tile)
	fireEvent.click(tileButton)
	return { tileElement, tileButton }
}

function finishLevel() {
	const { tileElement: tileElement1, tileButton: tileButton1 } =
		clickTile("1-1")
	const { tileElement: tileElement2, tileButton: tileButton2 } =
		clickTile("1-2")
	return { tileElement1, tileButton1, tileElement2, tileButton2 }
}

function requestNextLevel() {
	fireEvent.click(screen.getByText("Solve next puzzle"))
}

function advanceLevelTransition() {
	return act(() => vi.advanceTimersByTimeAsync(1000))
}

beforeEach(() => {
	vi.useFakeTimers({ shouldAdvanceTime: true })
	vi.resetAllMocks()
	mockedCreatePuzzleData.mockResolvedValue(getMockedPuzzleData())
})

afterEach(() => {
	vi.useRealTimers()
	vi.clearAllTimers()
})

describe("PuzzlePage", () => {
	describe("loading", () => {
		it("renders correctly with loading state", () => {
			mockedCreatePuzzleData.mockReturnValue(new Promise(() => {}))
			const renderResult = render(<PuzzlePage />)

			expect(getLoadingMessage()).toBeInTheDocument()
			expect(renderResult.container).toMatchSnapshot()
		})

		it("renders correctly with error state", async () => {
			mockedCreatePuzzleData.mockRejectedValue(new Error(""))
			const renderResult = render(<PuzzlePage />)

			await findErrorMessage()
			expect(renderResult.container).toMatchSnapshot()
		})

		it("renders correctly with loaded image", async () => {
			const renderResult = await renderPuzzlePage()

			expect(renderResult.container).toMatchSnapshot()
			expectPageChrome({ isFinished: false, isUpdating: false })
		})

		it("ignores promise resolution of cancelled request", async () => {
			const deferred1 = createDeferred<PuzzleData>()
			const deferred2 = createDeferred<PuzzleData>()
			mockedCreatePuzzleData
				.mockReturnValueOnce(deferred1.promise)
				.mockReturnValueOnce(deferred2.promise)
			render(
				<StrictMode>
					<PuzzlePage />
				</StrictMode>
			)

			deferred1.resolve({ ...getMockedPuzzleData(), levelNumber: 0 })
			await act(() => Promise.resolve())
			expect(getLoadingMessage()).toBeInTheDocument()
			deferred2.resolve({ ...getMockedPuzzleData(), levelNumber: 5 })
			expect(await screen.findByText("Level 6")).toBeInTheDocument()
		})

		it("ignores promise rejection of cancelled request", async () => {
			const deferred1 = createDeferred<PuzzleData>()
			const deferred2 = createDeferred<PuzzleData>()
			mockedCreatePuzzleData
				.mockReturnValueOnce(deferred1.promise)
				.mockReturnValueOnce(deferred2.promise)
			render(
				<StrictMode>
					<PuzzlePage />
				</StrictMode>
			)

			deferred1.reject()
			await act(() => Promise.resolve())
			expect(getLoadingMessage()).toBeInTheDocument()
			deferred2.resolve({ ...getMockedPuzzleData(), levelNumber: 5 })
			expect(await screen.findByText("Level 6")).toBeInTheDocument()
		})
	})

	describe("restarting", () => {
		it("restarts the puzzle on restart button click", async () => {
			render(<PuzzlePage />)
			const restartButton = await screen.findByRole("button", {
				name: "Restart",
			})
			const tileElement = getTileElement("1-1")

			fireEvent.click(restartButton)

			expect(mockedRestartLevel).toHaveBeenCalledOnce()
			expect(mockedRestartLevel).toHaveBeenCalledWith(
				getMockedPuzzleData().level
			)
			expect(mockedCreatePuzzleData).toHaveBeenCalledOnce()
			expectPageChrome({ isFinished: false, isUpdating: false })
			expect(getTileElement("1-1")).not.toBe(tileElement)
		})
	})

	describe("game process", () => {
		it("ignores click on play button when level is not finished", async () => {
			render(<PuzzlePage />)
			const playButton = await screen.findByText("Solve next puzzle")

			fireEvent.click(playButton)
			await advanceLevelTransition()

			expect(mockedRestartLevel).not.toHaveBeenCalled()
			expect(mockedCreatePuzzleData).toHaveBeenCalledOnce()
			expect(screen.getByText("Level 1")).toBeInTheDocument()
			expect(
				screen.getByRole("button", { name: "Restart" })
			).toBeInTheDocument()
			expectPageChrome({ isFinished: false, isUpdating: false })
		})

		it("continues level when level is not finished", async () => {
			await renderPuzzlePage()

			const { tileElement } = clickTile("1-1")

			expectTileBeingMovedAt({ element: tileElement, row: 1, column: 1 })
			expectPageChrome({ isFinished: false, isUpdating: false })
		})
	})

	describe("finishing level", () => {
		it("updates level number when finished", async () => {
			await renderPuzzlePage()
			finishLevel()

			expect(getLevelNumber()).toBe(1)
		})

		it("renders correctly when finished", async () => {
			await renderPuzzlePage()
			finishLevel()

			expect(mockedRestartLevel).not.toHaveBeenCalled()
			expect(mockedCreatePuzzleData).toHaveBeenCalledOnce()
			expectPageChrome({ isFinished: true, isUpdating: false })
		})

		it("ignores restart button click when level is finished", async () => {
			await renderPuzzlePage()
			finishLevel()

			const restartButton = await screen.findByRole("button", {
				name: "Restart",
			})
			fireEvent.click(restartButton)

			expect(mockedRestartLevel).not.toHaveBeenCalled()
		})

		it("ignores tile clicks when level is finished", async () => {
			await renderPuzzlePage()
			const { tileElement1, tileButton1, tileElement2, tileButton2 } =
				finishLevel()
			expectTileBeingMovedAt({ element: tileElement1, row: 1, column: 1 })
			expectTileBeingMovedAt({ element: tileElement2, row: 1, column: 2 })

			fireEvent.click(tileButton2)
			fireEvent.click(tileButton1)
			expectTileBeingMovedAt({ element: tileElement1, row: 1, column: 1 })
			expectTileBeingMovedAt({ element: tileElement2, row: 1, column: 2 })
		})
	})

	describe("new level loading", () => {
		it("updates after new level button click", async () => {
			await renderPuzzlePage()
			finishLevel()
			requestNextLevel()

			expectPageChrome({ isFinished: true, isUpdating: true })
			expect(queryLoadingMessage()).not.toBeInTheDocument()
		})

		it("does nothing before transition ends", async () => {
			await renderPuzzlePage()
			mockedCreatePuzzleData.mockReturnValue(new Promise(() => {}))
			finishLevel()
			requestNextLevel()
			act(() => {
				vi.advanceTimersByTime(999)
			})

			expectPageChrome({ isFinished: true, isUpdating: true })
			expect(queryLoadingMessage()).not.toBeInTheDocument()
			expect(mockedCreatePuzzleData).toHaveBeenCalledOnce()
		})

		it("loads new level after new level button click", async () => {
			await renderPuzzlePage()
			mockedCreatePuzzleData.mockReturnValue(new Promise(() => {}))
			finishLevel()
			requestNextLevel()
			await advanceLevelTransition()

			expect(getLoadingMessage()).toBeInTheDocument()
			expect(queryPuzzleBoard()).not.toBeInTheDocument()
			expect(mockedCreatePuzzleData).toHaveBeenCalledTimes(2)
		})

		it("renders new level after new level button click", async () => {
			await renderPuzzlePage()
			const { promise, resolve } = createDeferred<PuzzleData>()
			mockedCreatePuzzleData.mockReturnValue(promise)
			finishLevel()
			requestNextLevel()
			await advanceLevelTransition()
			resolve({
				...getMockedPuzzleData(),
				levelNumber: 1,
			})

			await screen.findByText("Level 2")
			expectPageChrome({ isFinished: false, isUpdating: false }, "Level 2")
			expect(mockedRestartLevel).not.toHaveBeenCalled()
			expect(mockedCreatePuzzleData).toHaveBeenCalledTimes(2)
		})

		it("renders error message if new level loading fails", async () => {
			await renderPuzzlePage()
			const { promise, reject } = createDeferred<PuzzleData>()
			mockedCreatePuzzleData.mockReturnValue(promise)
			finishLevel()
			requestNextLevel()
			await advanceLevelTransition()
			reject()

			expect(await findErrorMessage()).toBeInTheDocument()
			expect(queryLoadingMessage()).not.toBeInTheDocument()
			expect(queryPuzzleBoard()).not.toBeInTheDocument()
		})

		it("ignores clicks on any button when new level is loading", async () => {
			await renderPuzzlePage()
			mockedCreatePuzzleData.mockReturnValue(new Promise(() => {}))
			finishLevel()
			requestNextLevel()

			const restartButton = screen.getByRole("button", { name: "Restart" })
			fireEvent.click(restartButton)
			requestNextLevel()
			expect(restartButton).toBeDisabled()
			expect(screen.getByText("Solve next puzzle")).toBeDisabled()

			await advanceLevelTransition()
			await advanceLevelTransition()

			expect(mockedRestartLevel).not.toHaveBeenCalled()
			expect(mockedCreatePuzzleData).toHaveBeenCalledTimes(2)
		})
	})
})

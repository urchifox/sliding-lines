// @vitest-environment happy-dom
import { act, fireEvent, render, screen } from "@testing-library/react"
import { StrictMode } from "react"

import { getLevelNumber } from "../progress/user"
import { createPuzzleData } from "../puzzle/domain/puzzleData"
import {
	getEmptyTile,
	getTileByKey,
	reshuffleTiles,
} from "../puzzle/domain/tiles"
import type {
	BoardState,
	PuzzleData,
	PuzzleTileInfo,
	TileKey,
} from "../puzzle/domain/types"
import {
	createAlmostSolvedTiles,
	createDeferred,
	expectTilePlacedAtPosition,
	getPuzzleBoard,
	getTileButton,
	getTileElement,
	queryPuzzleBoard,
} from "../test/testHelpers"
import { PuzzlePage } from "./PuzzlePage"
import {
	errorText,
	getLevelNameText,
	loadingText,
	playButtonText,
	restartButtonLabel,
	winHeaderText,
} from "./PuzzlePageHelpers"

vi.mock("../puzzle/domain/puzzleData", () => ({
	createPuzzleData: vi.fn(),
}))

vi.mock("../puzzle/domain/tiles", async (importOriginal) => {
	const actual = await importOriginal<typeof import("../puzzle/domain/tiles")>()
	return {
		...actual,
		reshuffleTiles: vi.fn(({ tiles }: { tiles: readonly unknown[] }) => tiles),
	}
})

const mockedCreatePuzzleData = vi.mocked(createPuzzleData)
const mockedReshuffleTiles = vi.mocked(reshuffleTiles)

function getLoadingMessage() {
	return screen.getByText(loadingText)
}

function queryLoadingMessage() {
	return screen.queryByText(loadingText)
}

function findErrorMessage() {
	return screen.findByText(errorText)
}

function getRestartButton() {
	return screen.getByRole("button", { name: restartButtonLabel })
}

function getWinHeader() {
	return screen.getByText(winHeaderText)
}

function getPlayButton() {
	return screen.getByText(playButtonText)
}

function findLevelName(levelNumber: number) {
	return screen.findByText(getLevelNameText(levelNumber))
}

function getLevelName(levelNumber: number) {
	return screen.getByText(getLevelNameText(levelNumber))
}

function getMockedPuzzleData(): PuzzleData {
	return {
		levelNumber: 0,
		level: {
			rows: 3,
			columns: 3,
			shuffleSteps: 1,
			tiles: createAlmostSolvedTiles(),
		},
		imageInfo: {
			imageUrl: "test-image.jpg",
			width: 300,
			height: 200,
			ratio: 1.5,
		},
	}
}

function expectPageChrome(state: BoardState, levelNumber = 0) {
	const puzzleBoard = getPuzzleBoard()
	const levelName = getLevelName(levelNumber)
	const restartButton = getRestartButton()
	const winHeader = getWinHeader()
	const playButton = getPlayButton()

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

function renderPageWithLoading() {
	mockedCreatePuzzleData.mockReturnValue(new Promise(() => {}))
	const renderResult = render(<PuzzlePage />)
	return renderResult
}

async function renderPageWithError() {
	mockedCreatePuzzleData.mockRejectedValue(new Error(""))
	const renderResult = render(<PuzzlePage />)
	await findErrorMessage()
	return renderResult
}

async function renderPageWithBoard() {
	mockedCreatePuzzleData.mockResolvedValue(getMockedPuzzleData())
	const renderResult = render(<PuzzlePage />)
	await findLevelName(0)
	return renderResult
}

function clickTile(key: TileKey) {
	const tileElement = getTileElement(key)
	const tile = getTileByKey(key, createAlmostSolvedTiles()) as PuzzleTileInfo
	const tileButton = getTileButton(tile)
	fireEvent.click(tileButton)
	return { tileElement, tileButton, tile }
}

function finishLevel() {
	const {
		tileElement: tileElement1,
		tileButton: tileButton1,
		tile: tile1,
	} = clickTile("1-1")
	const {
		tileElement: tileElement2,
		tileButton: tileButton2,
		tile: tile2,
	} = clickTile("1-2")
	return {
		tileElement1,
		tileButton1,
		tile1,
		tileElement2,
		tileButton2,
		tile2,
	}
}

function requestNextLevel() {
	fireEvent.click(getPlayButton())
}

function useTransitionTimers() {
	vi.useFakeTimers()
}

function advanceLevelTransition(milliseconds = 1000) {
	act(() => {
		vi.advanceTimersByTime(milliseconds)
	})
}

beforeEach(() => {
	vi.resetAllMocks()
})

afterEach(() => {
	vi.useRealTimers()
})

describe("PuzzlePage", () => {
	describe("loading", () => {
		it("renders correctly with loading state", () => {
			const renderResult = renderPageWithLoading()

			expect(renderResult.container).toMatchSnapshot()
		})

		it("renders correctly with error state", async () => {
			const renderResult = await renderPageWithError()

			expect(renderResult.container).toMatchSnapshot()
		})

		it("renders correctly with loaded image", async () => {
			const renderResult = await renderPageWithBoard()

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

			await act(async () => {
				deferred1.resolve({ ...getMockedPuzzleData(), levelNumber: 0 })
				await deferred1.promise
			})
			expect(getLoadingMessage()).toBeInTheDocument()
			await act(async () => {
				deferred2.resolve({ ...getMockedPuzzleData(), levelNumber: 5 })
				await deferred2.promise
			})
			expect(getLevelName(5)).toBeInTheDocument()
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

			const ignoredRejection = deferred1.promise.catch(() => undefined)
			await act(() => {
				deferred1.reject()
				return ignoredRejection
			})
			expect(getLoadingMessage()).toBeInTheDocument()
			await act(async () => {
				deferred2.resolve({ ...getMockedPuzzleData(), levelNumber: 5 })
				await deferred2.promise
			})
			expect(getLevelName(5)).toBeInTheDocument()
		})
	})

	describe("restarting", () => {
		it("restarts the puzzle on restart button click", async () => {
			await renderPageWithBoard()
			const restartButton = getRestartButton()
			const tileElement = getTileElement("1-1")

			fireEvent.click(restartButton)

			expect(mockedReshuffleTiles).toHaveBeenCalledOnce()
			expect(mockedReshuffleTiles).toHaveBeenCalledWith({
				tiles: getMockedPuzzleData().level.tiles,
				shuffleSteps: getMockedPuzzleData().level.shuffleSteps,
			})
			expect(mockedCreatePuzzleData).toHaveBeenCalledOnce()
			expectPageChrome({ isFinished: false, isUpdating: false })
			expect(getTileElement("1-1")).not.toBe(tileElement)
		})
	})

	describe("game process", () => {
		it("ignores click on play button when level is not finished", async () => {
			await renderPageWithBoard()
			useTransitionTimers()
			const playButton = getPlayButton()

			fireEvent.click(playButton)
			advanceLevelTransition()

			expect(mockedReshuffleTiles).not.toHaveBeenCalled()
			expect(mockedCreatePuzzleData).toHaveBeenCalledOnce()
			expect(getLevelName(0)).toBeInTheDocument()
			expect(getRestartButton()).toBeInTheDocument()
			expectPageChrome({ isFinished: false, isUpdating: false })
		})

		it("ignores a click on the empty tile", async () => {
			await renderPageWithBoard()
			const tiles = createAlmostSolvedTiles()
			const emptySlot = getEmptyTile(tiles) as PuzzleTileInfo
			const button = getTileButton(emptySlot) as HTMLButtonElement

			button.disabled = false
			fireEvent.click(button)

			expect(getLevelNumber()).toBe(0)
			for (const tile of tiles) {
				expectTilePlacedAtPosition({
					element: getTileElement(tile.key),
					tileInfo: tile,
				})
			}
		})

		it("continues level when level is not finished", async () => {
			await renderPageWithBoard()

			const { tileElement, tile } = clickTile("1-1")

			expectTilePlacedAtPosition({
				element: tileElement,
				tileInfo: { ...tile, currentPosition: { row: 1, column: 1 } },
			})
			expectPageChrome({ isFinished: false, isUpdating: false })
		})
	})

	describe("finishing level", () => {
		it("updates level number when finished", async () => {
			await renderPageWithBoard()
			finishLevel()

			expect(getLevelNumber()).toBe(1)
		})

		it("renders correctly when finished", async () => {
			await renderPageWithBoard()
			finishLevel()

			expect(mockedReshuffleTiles).not.toHaveBeenCalled()
			expect(mockedCreatePuzzleData).toHaveBeenCalledOnce()
			expectPageChrome({ isFinished: true, isUpdating: false })
		})

		it("ignores restart button click when level is finished", async () => {
			await renderPageWithBoard()
			finishLevel()

			const restartButton = getRestartButton()
			fireEvent.click(restartButton)

			expect(mockedReshuffleTiles).not.toHaveBeenCalled()
		})

		it("ignores tile clicks when level is finished", async () => {
			await renderPageWithBoard()
			const {
				tileElement1,
				tileButton1,
				tile1,
				tileElement2,
				tileButton2,
				tile2,
			} = finishLevel()
			expectTilePlacedAtPosition({
				element: tileElement1,
				tileInfo: { ...tile1, currentPosition: { row: 1, column: 1 } },
			})
			expectTilePlacedAtPosition({
				element: tileElement2,
				tileInfo: { ...tile2, currentPosition: { row: 1, column: 2 } },
			})

			const finishedTileButton1 = tileButton1 as HTMLButtonElement
			const finishedTileButton2 = tileButton2 as HTMLButtonElement
			finishedTileButton1.disabled = false
			finishedTileButton2.disabled = false
			fireEvent.click(finishedTileButton2)
			fireEvent.click(finishedTileButton1)
			expectTilePlacedAtPosition({
				element: tileElement1,
				tileInfo: { ...tile1, currentPosition: { row: 1, column: 1 } },
			})
			expectTilePlacedAtPosition({
				element: tileElement2,
				tileInfo: { ...tile2, currentPosition: { row: 1, column: 2 } },
			})
		})
	})

	describe("new level loading", () => {
		it("ignores tile clicks while the next level is updating", async () => {
			await renderPageWithBoard()
			const {
				tileButton1,
				tile1,
				tileElement1,
				tileButton2,
				tile2,
				tileElement2,
			} = finishLevel()
			requestNextLevel()

			const updatingTileButton1 = tileButton1 as HTMLButtonElement
			const updatingTileButton2 = tileButton2 as HTMLButtonElement
			updatingTileButton1.disabled = false
			updatingTileButton2.disabled = false
			fireEvent.click(updatingTileButton1)
			fireEvent.click(updatingTileButton2)

			expectPageChrome({ isFinished: true, isUpdating: true })
			expect(mockedCreatePuzzleData).toHaveBeenCalledOnce()
			expectTilePlacedAtPosition({
				element: tileElement1,
				tileInfo: { ...tile1, currentPosition: { row: 1, column: 1 } },
			})
			expectTilePlacedAtPosition({
				element: tileElement2,
				tileInfo: { ...tile2, currentPosition: { row: 1, column: 2 } },
			})
		})

		it("updates after new level button click", async () => {
			await renderPageWithBoard()
			finishLevel()
			requestNextLevel()

			expectPageChrome({ isFinished: true, isUpdating: true })
			expect(queryLoadingMessage()).not.toBeInTheDocument()
		})

		it("does nothing before transition ends", async () => {
			await renderPageWithBoard()
			useTransitionTimers()
			mockedCreatePuzzleData.mockReturnValue(new Promise(() => {}))
			finishLevel()
			requestNextLevel()
			advanceLevelTransition(999)

			expectPageChrome({ isFinished: true, isUpdating: true })
			expect(queryLoadingMessage()).not.toBeInTheDocument()
			expect(mockedCreatePuzzleData).toHaveBeenCalledOnce()
		})

		it("loads new level after new level button click", async () => {
			await renderPageWithBoard()
			useTransitionTimers()
			mockedCreatePuzzleData.mockReturnValue(new Promise(() => {}))
			finishLevel()
			requestNextLevel()
			advanceLevelTransition()

			expect(getLoadingMessage()).toBeInTheDocument()
			expect(queryPuzzleBoard()).not.toBeInTheDocument()
			expect(mockedCreatePuzzleData).toHaveBeenCalledTimes(2)
		})

		it("renders new level after new level button click", async () => {
			await renderPageWithBoard()
			useTransitionTimers()
			const { promise, resolve } = createDeferred<PuzzleData>()
			mockedCreatePuzzleData.mockReturnValue(promise)
			finishLevel()
			requestNextLevel()
			advanceLevelTransition()
			vi.useRealTimers()
			await act(async () => {
				resolve({
					...getMockedPuzzleData(),
					levelNumber: 1,
				})
				await promise
			})

			expect(getLevelName(1)).toBeInTheDocument()
			expectPageChrome({ isFinished: false, isUpdating: false }, 1)
			expect(mockedReshuffleTiles).not.toHaveBeenCalled()
			expect(mockedCreatePuzzleData).toHaveBeenCalledTimes(2)
		})

		it("renders error message if new level loading fails", async () => {
			await renderPageWithBoard()
			useTransitionTimers()
			const { promise, reject } = createDeferred<PuzzleData>()
			mockedCreatePuzzleData.mockReturnValue(promise)
			finishLevel()
			requestNextLevel()
			advanceLevelTransition()
			vi.useRealTimers()
			const ignoredRejection = promise.catch(() => undefined)
			await act(() => {
				reject()
				return ignoredRejection
			})

			expect(await findErrorMessage()).toBeInTheDocument()
			expect(queryLoadingMessage()).not.toBeInTheDocument()
			expect(queryPuzzleBoard()).not.toBeInTheDocument()
		})

		it("ignores clicks on any button when new level is loading", async () => {
			await renderPageWithBoard()
			useTransitionTimers()
			mockedCreatePuzzleData.mockReturnValue(new Promise(() => {}))
			finishLevel()
			requestNextLevel()

			const restartButton = getRestartButton()
			fireEvent.click(restartButton)
			requestNextLevel()
			expect(restartButton).toBeDisabled()
			expect(getPlayButton()).toBeDisabled()

			advanceLevelTransition()
			advanceLevelTransition()

			expect(mockedReshuffleTiles).not.toHaveBeenCalled()
			expect(mockedCreatePuzzleData).toHaveBeenCalledTimes(2)
		})
	})
})

// @vitest-environment happy-dom
import { act, fireEvent, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import * as tilesDomain from "../puzzle/domain/tiles"
import { createPuzzleData } from "../puzzle/domain/puzzleData"
import { getEmptyTile, getTileByKey } from "../puzzle/domain/tiles"
import type {
	BoardState,
	PuzzleData,
	PuzzleTileInfo,
	TileKey,
} from "../puzzle/domain/types"
import { store } from "../store"
import { reshuffleTilesAction } from "../store/puzzleSlice"
import { selectLevelNumber } from "../store/selectors"
import {
	createAlmostSolvedTiles,
	createDeferred,
	createTestPuzzleData,
	expectTilePlacedAtPosition,
	expectTilesUnmoved,
	getPuzzleBoard,
	getTileElements,
	queryPuzzleBoard,
	renderWithStore,
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

const mockedCreatePuzzleData = vi.mocked(createPuzzleData)
let dispatchSpy = vi.spyOn(store, "dispatch")

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

function renderPageWithStore({
	isStrictMode,
}: { isStrictMode?: boolean } = {}) {
	return renderWithStore({ ui: <PuzzlePage />, isStrictMode })
}

function renderPageWithLoading() {
	mockedCreatePuzzleData.mockReturnValue(new Promise(() => {}))
	const renderResult = renderPageWithStore()
	return renderResult
}

async function renderPageWithError() {
	mockedCreatePuzzleData.mockRejectedValue(new Error(""))
	const renderResult = renderPageWithStore()
	await findErrorMessage()
	return renderResult
}

async function renderPageWithBoard() {
	mockedCreatePuzzleData.mockResolvedValue(createTestPuzzleData())
	const renderResult = renderPageWithStore()
	await findLevelName(0)
	return renderResult
}

function clickTile(key: TileKey) {
	const tile = getTileByKey(key, createAlmostSolvedTiles()) as PuzzleTileInfo
	const { tile: tileElement, button: tileButton } = getTileElements(key)
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
	dispatchSpy = vi.spyOn(store, "dispatch")
	vi.spyOn(tilesDomain, "reshuffleTiles").mockImplementation(({ tiles }) => [
		...tiles,
	])
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
			const cancelledImageUrl = "cancelled.jpg"
			const activeImageUrl = "active.jpg"
			const deferred1 = createDeferred<PuzzleData>()
			const deferred2 = createDeferred<PuzzleData>()
			mockedCreatePuzzleData
				.mockReturnValueOnce(deferred1.promise)
				.mockReturnValueOnce(deferred2.promise)
			renderPageWithStore({ isStrictMode: true })

			await act(async () => {
				deferred1.resolve(createTestPuzzleData(cancelledImageUrl))
				await deferred1.promise
			})
			expect(getLoadingMessage()).toBeInTheDocument()
			await act(async () => {
				deferred2.resolve(createTestPuzzleData(activeImageUrl))
				await deferred2.promise
			})
			expect(getPuzzleBoard()).toHaveStyle({
				"--image": `url(${activeImageUrl})`,
			})
		})

		it("ignores promise rejection of cancelled request", async () => {
			const activeImageUrl = "active.jpg"
			const deferred1 = createDeferred<PuzzleData>()
			const deferred2 = createDeferred<PuzzleData>()
			mockedCreatePuzzleData
				.mockReturnValueOnce(deferred1.promise)
				.mockReturnValueOnce(deferred2.promise)
			renderPageWithStore({ isStrictMode: true })

			const ignoredRejection = deferred1.promise.catch(() => undefined)
			await act(() => {
				deferred1.reject()
				return ignoredRejection
			})
			expect(getLoadingMessage()).toBeInTheDocument()
			await act(async () => {
				deferred2.resolve(createTestPuzzleData(activeImageUrl))
				await deferred2.promise
			})
			expect(getPuzzleBoard()).toHaveStyle({
				"--image": `url(${activeImageUrl})`,
			})
		})
	})

	describe("restarting", () => {
		it("restarts the puzzle on restart button click", async () => {
			await renderPageWithBoard()
			const restartButton = getRestartButton()
			const { tile: tileElement } = getTileElements("1-1")

			fireEvent.click(restartButton)

			expect(dispatchSpy).toHaveBeenCalledWith(reshuffleTilesAction())
			expect(mockedCreatePuzzleData).toHaveBeenCalledOnce()
			expectPageChrome({ isFinished: false, isUpdating: false })
			expect(getTileElements("1-1").tile).not.toBe(tileElement)
		})
	})

	describe("game process", () => {
		it("ignores click on play button when level is not finished", async () => {
			await renderPageWithBoard()
			useTransitionTimers()
			const playButton = getPlayButton()

			fireEvent.click(playButton)
			advanceLevelTransition()

			expect(vi.mocked(tilesDomain.reshuffleTiles)).not.toHaveBeenCalled()
			expect(mockedCreatePuzzleData).toHaveBeenCalledOnce()
			expect(getLevelName(0)).toBeInTheDocument()
			expect(getRestartButton()).toBeInTheDocument()
			expectPageChrome({ isFinished: false, isUpdating: false })
		})

		it("ignores a click on the empty tile", async () => {
			await renderPageWithBoard()
			const tiles = createAlmostSolvedTiles()
			const emptySlot = getEmptyTile(tiles) as PuzzleTileInfo
			const { button } = getTileElements(emptySlot.key)

			button.disabled = false
			fireEvent.click(button)

			expect(selectLevelNumber()).toBe(0)
			expectTilesUnmoved(tiles)
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

			expect(selectLevelNumber()).toBe(1)
		})

		it("renders correctly when finished", async () => {
			await renderPageWithBoard()
			finishLevel()

			expect(vi.mocked(tilesDomain.reshuffleTiles)).not.toHaveBeenCalled()
			expect(mockedCreatePuzzleData).toHaveBeenCalledOnce()
			expectPageChrome({ isFinished: true, isUpdating: false })
		})

		it("moves focus to the win heading when the level is finished", async () => {
			const user = userEvent.setup()
			await renderPageWithBoard()
			expect(getWinHeader()).not.toHaveFocus()

			finishLevel()

			const winHeader = getWinHeader()
			expect(winHeader).toHaveFocus()
			expect(winHeader.tabIndex).toBe(-1)

			await user.tab()

			expect(getPlayButton()).toHaveFocus()
		})

		it("ignores restart button click when level is finished", async () => {
			await renderPageWithBoard()
			finishLevel()

			const restartButton = getRestartButton()
			fireEvent.click(restartButton)

			expect(vi.mocked(tilesDomain.reshuffleTiles)).not.toHaveBeenCalled()
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
				resolve(createTestPuzzleData())
				await promise
			})

			expect(getLevelName(1)).toBeInTheDocument()
			expectPageChrome({ isFinished: false, isUpdating: false }, 1)
			expect(vi.mocked(tilesDomain.reshuffleTiles)).not.toHaveBeenCalled()
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

			expect(vi.mocked(tilesDomain.reshuffleTiles)).not.toHaveBeenCalled()
			expect(mockedCreatePuzzleData).toHaveBeenCalledTimes(2)
		})
	})
})

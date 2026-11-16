import {
	type Dispatch,
	type PayloadAction,
	createAsyncThunk,
	createSlice,
} from "@reduxjs/toolkit"

import type { RootState } from "."
import { isPuzzleSolved, tryMove } from "../puzzle/domain/game"
import { createPuzzleData } from "../puzzle/domain/puzzleData"
import { reshuffleTiles } from "../puzzle/domain/tiles"
import type {
	PuzzleData,
	PuzzleTileInfo,
	PuzzleTilesArray,
} from "../puzzle/domain/types"
import { selectLevelsCompletedCount } from "./progressSlice"

type PuzzleState = (PuzzleData & { isSolved: boolean }) | null
const initialState = null as PuzzleState

export const loadPuzzleData = createAsyncThunk<
	PuzzleData,
	void,
	{ state: RootState }
>("puzzle/loadPuzzleData", async (_, { getState }) => {
	const levelNumber = selectLevelsCompletedCount(getState())
	const puzzleData = await createPuzzleData(levelNumber)
	return puzzleData
})

const puzzleSlice = createSlice({
	name: "puzzle",
	initialState,
	reducers: {
		setPuzzleData: (_, action: PayloadAction<PuzzleData>) => {
			return { ...action.payload, isSolved: false }
		},

		resetPuzzleData: () => initialState,

		setPuzzleTiles: (
			state: PuzzleState,
			action: PayloadAction<PuzzleTilesArray>
		) => {
			if (state === null) {
				return
			}

			state.level.tiles = action.payload
		},

		processMove: (
			state: PuzzleState,
			action: PayloadAction<PuzzleTileInfo>
		) => {
			if (state === null || state.isSolved) {
				return
			}

			const updatedTiles = tryMove(action.payload, state.level.tiles)
			if (updatedTiles === null) {
				return
			}

			if (isPuzzleSolved(updatedTiles)) {
				state.isSolved = true
			}

			state.level.tiles = updatedTiles
		},
	},
	extraReducers: (builder) => {
		builder.addCase(
			loadPuzzleData.fulfilled,
			(_, action: PayloadAction<PuzzleData>) => {
				return { ...action.payload, isSolved: false }
			}
		)
	},

	selectors: {
		selectPuzzleData: (state) => state,
		selectPuzzleIsSolved: (state) => state?.isSolved ?? false,
		selectPuzzleTiles: (state) => state?.level.tiles ?? [],
	},
})

export const puzzleReducer = puzzleSlice.reducer
export const {
	setPuzzleData: setPuzzleDataAction,
	resetPuzzleData: resetPuzzleDataAction,
	processMove: processMoveAction,
} = puzzleSlice.actions

export function reshuffleTilesAction() {
	return (dispatch: Dispatch, getState: () => RootState) => {
		const puzzleData = getState().puzzle
		if (puzzleData === null) {
			return
		}

		const tiles = reshuffleTiles({
			tiles: puzzleData.level.tiles,
			shuffleSteps: puzzleData.level.shuffleSteps,
		})
		dispatch(puzzleSlice.actions.setPuzzleTiles(tiles))
	}
}

export const { selectPuzzleData, selectPuzzleIsSolved, selectPuzzleTiles } =
	puzzleSlice.selectors

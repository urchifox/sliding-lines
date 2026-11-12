import { type PayloadAction, createSlice } from "@reduxjs/toolkit"

import type { PuzzleData, PuzzleTilesArray } from "../puzzle/domain/types"

type PuzzleState = PuzzleData | null
const initialState = null as PuzzleState

const puzzleSlice = createSlice({
	name: "puzzle",
	initialState,
	reducers: {
		setPuzzleData: (_, action: PayloadAction<PuzzleData>) => {
			return { ...action.payload }
		},
		resetPuzzleData: () => initialState,
		updateTiles: (
			state: PuzzleState,
			action: PayloadAction<PuzzleTilesArray>
		) => {
			if (state === null) {
				return
			}
			state.level.tiles = action.payload
		},
	},
})

export const puzzleReducer = puzzleSlice.reducer
export const { setPuzzleData, resetPuzzleData, updateTiles } =
	puzzleSlice.actions

import { type PayloadAction, createSlice } from "@reduxjs/toolkit"

import { isPuzzleSolved, tryMove } from "../puzzle/domain/game"
import { reshuffleTiles } from "../puzzle/domain/tiles"
import type { PuzzleData, PuzzleTileInfo } from "../puzzle/domain/types"

type PuzzleState = (PuzzleData & { isSolved: boolean }) | null
const initialState = null as PuzzleState

const puzzleSlice = createSlice({
	name: "puzzle",
	initialState,
	reducers: {
		setPuzzleData: (_, action: PayloadAction<PuzzleData>) => {
			return { ...action.payload, isSolved: false }
		},

		resetPuzzleData: () => initialState,

		reshuffleTiles: (state: PuzzleState) => {
			if (state === null) {
				return
			}

			state.level.tiles = reshuffleTiles({
				tiles: state.level.tiles,
				shuffleSteps: state.level.shuffleSteps,
			})
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
})

export const puzzleReducer = puzzleSlice.reducer
export const {
	setPuzzleData: setPuzzleDataAction,
	resetPuzzleData: resetPuzzleDataAction,
	reshuffleTiles: reshuffleTilesAction,
	processMove: processMoveAction,
} = puzzleSlice.actions

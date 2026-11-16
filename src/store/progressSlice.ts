import { createSlice } from "@reduxjs/toolkit"

type ProgressState = {
	levelsCompletedCount: number
}
const initialState = {
	levelsCompletedCount: 0,
} as ProgressState

const progressSlice = createSlice({
	name: "progress",
	initialState,
	reducers: {
		incrementLevelsCompletedCount: (state) => {
			state.levelsCompletedCount++
		},
		resetProgress: () => initialState,
	},
	selectors: {
		selectLevelsCompletedCount: (state) => state.levelsCompletedCount,
	},
})

export const progressReducer = progressSlice.reducer
export const { incrementLevelsCompletedCount, resetProgress } =
	progressSlice.actions
export const { selectLevelsCompletedCount } = progressSlice.selectors

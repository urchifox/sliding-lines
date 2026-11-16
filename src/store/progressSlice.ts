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
		upgradeLevelselectsCompletedCount: (state) => {
			state.levelsCompletedCount++
		},
		resetProgress: () => initialState,
	},
})

export const progressReducer = progressSlice.reducer
export const { upgradeLevelselectsCompletedCount, resetProgress } = progressSlice.actions

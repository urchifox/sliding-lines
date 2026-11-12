import { createSlice } from "@reduxjs/toolkit"

type ProgressState = {
	levelNumber: number
}
const initialState = {
	levelNumber: 0,
} as ProgressState

const progressSlice = createSlice({
	name: "progress",
	initialState,
	reducers: {
		upgradeLevel: (state) => {
			state.levelNumber++
		},
		resetProgress: () => initialState,
	},
})

export const progressReducer = progressSlice.reducer
export const { upgradeLevel, resetProgress } = progressSlice.actions

import { combineReducers, configureStore } from "@reduxjs/toolkit"
import {
	FLUSH,
	PAUSE,
	PERSIST,
	PURGE,
	REGISTER,
	REHYDRATE,
	persistReducer,
	persistStore,
} from "redux-persist"
import storage from "redux-persist/lib/storage"

import { listenerMiddleware } from "./listenerMiddleware"
import { progressReducer, resetProgress } from "./progressSlice"
import { puzzleReducer, resetPuzzleDataAction } from "./puzzleSlice"

const persistConfig = {
	key: "root",
	storage,
}

const rootReducer = combineReducers({
	puzzle: puzzleReducer,
	progress: progressReducer,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
	reducer: persistedReducer,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
			},
		}).prepend(listenerMiddleware.middleware),
})

export const persistor = persistStore(store)

export function resetStore() {
	store.dispatch(resetPuzzleDataAction())
	store.dispatch(resetProgress())
}

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type AppThunk<ReturnType = void> = (
	dispatch: AppDispatch,
	getState: () => RootState
) => ReturnType

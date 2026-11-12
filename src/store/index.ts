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

import { progressReducer } from "./progressSlice"
import { puzzleReducer } from "./puzzleSlice"

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
		}),
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

import { useEffect, useState } from "react"

import { loadPuzzleData, selectPuzzleData } from "../store/puzzleSlice"
import { useAppDispatch, useAppSelector } from "./redux"

export function useLoadPuzzle() {
	const dispatch = useAppDispatch()
	const puzzleData = useAppSelector(selectPuzzleData)
	const [isError, setError] = useState<boolean>(false)

	useEffect(() => {
		if (puzzleData !== null) {
			return
		}

		const request = dispatch(loadPuzzleData())
		request.unwrap().catch((error: unknown) => {
			if (
				typeof error === "object" &&
				error !== null &&
				"name" in error &&
				error.name === "AbortError"
			) {
				return
			}

			setError(true)
		})

		return () => {
			request.abort()
		}
	}, [dispatch, puzzleData])

	return {
		puzzleData,
		isError,
	}
}

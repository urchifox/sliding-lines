import { useState } from "react"

import type { PuzzleTilesArray, TileKey } from "../puzzle/domain/types"
import { handleRovingTabindex } from "../puzzle/flow/handleRovingTabindex"

export function useRovingTabindex({
	initialFocusedTileKey,
	tiles,
	columns,
	rows,
}: {
	initialFocusedTileKey: TileKey | null
	tiles: PuzzleTilesArray
	columns: number
	rows: number
}) {
	const [focusedTileKey, setFocusedTileKey] = useState<TileKey | null>(
		initialFocusedTileKey
	)

	const onKeyDown = (event: React.KeyboardEvent<HTMLUListElement>) => {
		const target = event.target as HTMLButtonElement
		const arrowKey = event.key
		if (arrowKey.startsWith("Arrow")) {
			event.preventDefault()
		}
		const tileKey = target.dataset.key as TileKey

		const tileToFocusKey = handleRovingTabindex({
			tiles,
			tileKey,
			arrowKey,
			columns,
			rows,
		})
		if (tileToFocusKey === null) {
			return
		}

		event.currentTarget
			.querySelector<HTMLButtonElement>(`button[data-key="${tileToFocusKey}"]`)
			?.focus()
	}

	const onFocus = (event: React.FocusEvent<HTMLUListElement>) => {
		const tileKey = event.target.dataset.key as TileKey
		setFocusedTileKey(tileKey)
	}

	return {
		focusedTileKey,
		onKeyDown,
		onFocus,
	}
}

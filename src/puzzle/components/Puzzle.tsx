import styled from "@emotion/styled"
import { useState } from "react"

import { clearList } from "../../assets/styles/mixins"
import { theme } from "../../assets/styles/theme"
import { getTileByCurrentPosition } from "../domain/tiles"
import {
	type BoardState,
	type ImageInfo,
	type PuzzleTileInfo,
	type PuzzleTilesArray,
	type TileKey,
} from "../domain/types"
import { handleRovingTabindex } from "../flow/handleRovingTabindex"
import { PuzzleTile } from "./PuzzleTile"
import { puzzleBoardName } from "./helpers"

const PuzzleStyled = styled.ul<
	{
		width: number
		height: number
		ratio: number
		columns: number
		rows: number
		imageUrl: string
	} & BoardState
>(
	({
		width,
		height,
		ratio,
		columns,
		rows,
		imageUrl,
		isFinished,
		isUpdating,
	}) => `
		${clearList};

		--ss-width: ${width}px;
		--ss-height: ${height}px;
		--ratio: ${ratio};
		--columns: ${columns};
		--rows: ${rows};
		--image: url(${imageUrl});

		--reveal-delay: ${isFinished ? "0.3s" : "0s"};
		--reveal-duration: 0.3s;

		position: relative;

		border-radius: 5px;
		border: 2px solid ${isFinished ? "transparent" : theme.color.secondary};
		width: min(var(--max-puzzle-width), calc(var(--max-puzzle-height) * var(--ratio)));
		height: min(var(--max-puzzle-height), calc(var(--max-puzzle-width) / var(--ratio)));

		aspect-ratio: var(--ratio);

		background-color: ${isFinished ? "transparent" : theme.color.secondary};

		display: grid;
		grid-template-rows: 1fr;
		grid-template-columns: 1fr;

		animation: ${isUpdating ? "disappear" : "appear"} var(--reveal-duration) ease both;

		transition:
			background-color var(--reveal-duration) var(--reveal-delay) ease,
			border-color var(--reveal-duration) var(--reveal-delay) ease;

		&::before {
			content: "";
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;

			width: 100%;
			height: 100%;

			background-repeat: no-repeat;
			background-size: cover;
			background-position: center;
			background-image: var(--image);

			opacity: ${isFinished ? 1 : 0};
			transition: opacity var(--reveal-duration) var(--reveal-delay) ease;
		}
	`
)

function getFirstClickableTileKey(tiles: PuzzleTilesArray): TileKey | null {
	let tile = getTileByCurrentPosition({ row: 1, column: 1 }, tiles)
	if (tile?.isEmpty) {
		tile = getTileByCurrentPosition({ row: 1, column: 2 }, tiles)
	}
	return tile?.key ?? null
}

export function Puzzle({
	imageInfo,
	boardState,
	handleTryMove,
	tiles,
	columns,
	rows,
}: {
	imageInfo: ImageInfo
	boardState: BoardState
	handleTryMove: (tile: PuzzleTileInfo) => void
	tiles: PuzzleTilesArray
	columns: number
	rows: number
}) {
	const [focusedTileKey, setFocusedTileKey] = useState<TileKey | null>(
		getFirstClickableTileKey(tiles)
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

	const elements = tiles.map((tile) => {
		const tabIndex = tile.key === focusedTileKey ? 0 : -1
		return (
			<PuzzleTile
				key={tile.key}
				tile={tile}
				handleClick={handleTryMove}
				isFinished={boardState.isFinished}
				tabIndex={tabIndex}
			/>
		)
	})

	return (
		<PuzzleStyled
			{...imageInfo}
			{...boardState}
			columns={columns}
			rows={rows}
			aria-label={puzzleBoardName}
			onKeyDown={onKeyDown}
			onFocus={onFocus}
		>
			{elements}
		</PuzzleStyled>
	)
}

import styled from "@emotion/styled"
import { useRef } from "react"

import { clearList } from "../../assets/styles/mixins"
import { theme } from "../../assets/styles/theme"
import { tryMove } from "../domain/game"
import { type BoardState, type ImageInfo, type Level } from "../domain/types"
import { PuzzleTile } from "./PuzzleTile"

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

		overflow: hidden;

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

export function Puzzle({
	imageInfo,
	onCompleteLevel,
	boardState,
	level,
}: {
	imageInfo: ImageInfo
	onCompleteLevel: () => void
	level: Level
	boardState: BoardState
}) {
	const { tiles, columns, rows } = level
	const puzzleRef = useRef<Record<string, HTMLElement | null>>({})

	const elements = tiles.map((tile) => {
		const handleClick = () => {
			if (boardState.isFinished) {
				return
			}

			const { isSolved, updatedTiles } = tryMove(tile, tiles)
			updatedTiles?.forEach(({ currentPosition, key }) => {
				const changedElement = puzzleRef.current[key]
				const { row, column } = currentPosition
				changedElement?.style.setProperty("--row", row.toString())
				changedElement?.style.setProperty("--col", column.toString())
			})

			if (isSolved) {
				onCompleteLevel()
			}
		}

		return (
			<PuzzleTile
				key={tile.key}
				tile={tile}
				handleClick={handleClick}
				puzzleRef={puzzleRef}
				isFinished={boardState.isFinished}
			/>
		)
	})

	return (
		<PuzzleStyled
			{...imageInfo}
			{...boardState}
			columns={columns}
			rows={rows}
			aria-label="Puzzle board"
		>
			{elements}
		</PuzzleStyled>
	)
}

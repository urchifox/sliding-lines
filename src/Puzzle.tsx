import styled from "@emotion/styled"
import { useRef } from "react"

import { PuzzleItem } from "./PuzzleItem"
import { clearList } from "./assets/styles/mixins"
import { theme } from "./assets/styles/theme"
import { type Level, createLevel, tryMove } from "./game"
import { type ImageInfo } from "./images"

const PuzzleStyled = styled.ul<{
	width: number
	height: number
	ratio: number
	columns: number
	rows: number
	imageUrl: string
	isFinished: boolean
	isUpdating: boolean
}>(
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

		position: relative;

		border-radius: 5px;
		border: 2px solid ${isFinished || isUpdating ? "transparent" : theme.color.secondary};
		width: min(var(--max-puzzle-width), calc(var(--max-puzzle-height) * var(--ratio)));
		height: min(var(--max-puzzle-height), calc(var(--max-puzzle-width) / var(--ratio)));

		aspect-ratio: var(--ratio);

		background-color: ${isFinished || isUpdating ? "transparent" : theme.color.secondary};

		display: grid;
		grid-template-rows: 1fr;
		grid-template-columns: 1fr;

		overflow: hidden;

		animation: ${isUpdating ? "disappear" : "appear"} 0.3s ease both;

		transition: background-color 0.3s ease, border-color 0.3s ease;

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
			transition: opacity 0.3s ease;
		}
	`
)

export function Puzzle({
	imageInfo,
	onCompleteLevel,
	isDisabled,
	isFinished,
	isUpdating,
}: {
	imageInfo: ImageInfo
	onCompleteLevel: () => void
	isDisabled: boolean
	isFinished: boolean
	isUpdating: boolean
}) {
	const levelRef = useRef<Level | null>(null)
	if (levelRef.current === null) {
		levelRef.current = createLevel()
	}

	const { items, columns, rows, emptySlotIndex } = levelRef.current
	const emptyItemInfo = items[emptySlotIndex]
	const puzzleRef = useRef<Record<string, HTMLElement | null>>({})

	const elements = items.map((item) => {
		const handleClick = () => {
			const isMoved = tryMove(item, items)

			if (isMoved) {
				;[item, emptyItemInfo].forEach(({ current, key }) => {
					const { row, column } = current
					const changedElement = puzzleRef.current[key]
					changedElement?.style.setProperty("--row", row.toString())
					changedElement?.style.setProperty("--col", column.toString())
				})

				const isFinished = items.every(
					({ current, original }) =>
						current.row === original.row && current.column === original.column
				)
				if (isFinished) {
					onCompleteLevel()
				}
			}
		}

		return PuzzleItem({
			item,
			handleClick,
			puzzleRef,
			isDisabled,
			isFinished,
		})
	})

	return (
		<PuzzleStyled
			{...imageInfo}
			columns={columns}
			rows={rows}
			isFinished={isFinished}
			isUpdating={isUpdating}
		>
			{[...elements]}
		</PuzzleStyled>
	)
}

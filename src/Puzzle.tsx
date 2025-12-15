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
}>(
	({ width, height, ratio, columns, rows, imageUrl, isFinished }) => `
		${clearList};

		--ss-width: ${width}px;
		--ss-height: ${height}px;
		--ratio: ${ratio};
		--columns: ${columns};
		--rows: ${rows};
		--image: url(${imageUrl});

		--max-width: 80vw;
		--max-height: 80vh;

		--max-size: min(80vw,80vh);

		position: relative;

		border-radius: 5px;
		border: 2px solid ${isFinished ? "transparent" : theme.color.secondary};
		width: min(var(--max-width), calc(var(--max-height) * var(--ratio)));
		height: min(var(--max-height), calc(var(--max-width) / var(--ratio)));

		aspect-ratio: var(--ratio);

		background-color: ${isFinished ? "transparent" : theme.color.secondary};

		display: grid;
		grid-template-rows: 1fr;
		grid-template-columns: 1fr;

		overflow: hidden;

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
}: {
	imageInfo: ImageInfo
	onCompleteLevel: () => void
	isDisabled: boolean
	isFinished: boolean
}) {
	const levelRef = useRef<Level | null>(null)
	if (levelRef.current === null) {
		levelRef.current = createLevel()
	}

	const { items, columns, rows, emptySlotIndex } = levelRef.current
	const emptyItemInfo = items[emptySlotIndex]
	const puzzleRef = useRef<Record<string, HTMLElement | null>>({})

	const elements = items.map((item, index) => {
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
			index,
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
		>
			{[...elements]}
		</PuzzleStyled>
	)
}

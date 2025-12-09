import styled from "@emotion/styled"
import { useRef } from "react"

import { PuzzleItem } from "./PuzzleItem"
import { clearList } from "./assets/styles/mixins"
import { type Level, tryMove } from "./game"
import { type ImageInfo } from "./images"

const PuzzleStyled = styled.ul<{
	width: number
	height: number
	ratio: number
	columns: number
	rows: number
	imageUrl: string
}>(
	({ width, height, ratio, columns, rows, imageUrl }) => `
		${clearList};

		--ss-width: ${width};
		--ss-height: ${height};
		--ratio: ${ratio};
		--columns: ${columns};
		--rows: ${rows};
		--image: url(${imageUrl});

		position: relative;

		border-radius: 5px;
		width: 300px;
		height: calc(300px / var(--ratio));
		background-color: grey;

		display: grid;
		grid-template-rows: 1fr;
		grid-template-columns: 1fr;

		overflow: hidden;
	`
)

export function Puzzle({
	level,
	imageInfo,
	onCompleteLevel,
	isDisabled,
	isFinished,
}: {
	level: Level
	imageInfo: ImageInfo
	onCompleteLevel: () => void
	isDisabled: boolean
	isFinished: boolean
}) {
	const { items, columns, rows, emptySlotIndex } = level
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
		<PuzzleStyled {...imageInfo} columns={columns} rows={rows}>
			{[...elements]}
		</PuzzleStyled>
	)
}

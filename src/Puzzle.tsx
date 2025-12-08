import styled from "@emotion/styled"

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

		&.disabled {
			pointer-events: none;
		}
	`
)

export function Puzzle({
	level,
	imageInfo,
	checkLevel,
	puzzleRef
}: {
	level: Level
	imageInfo: ImageInfo
	puzzleRef: React.RefObject<Record<string, HTMLElement | null>>
	checkLevel: () => void
}) {
	const { items, columns, rows, emptySlotIndex } = level
	const emptyItemInfo = items[emptySlotIndex]

	const elements = items.map((item, index) => {
		const handleClick = () => {
			const isMoved = tryMove(item, items)
			
			if (isMoved) {
				;[item, emptyItemInfo].forEach((info) => {
					const { row, column } = info.current
					const changedElement = puzzleRef.current[info.key]
					changedElement?.style.setProperty("--row", row.toString())
					changedElement?.style.setProperty("--col", column.toString())
				})

				checkLevel()
			}
		}

		return PuzzleItem({
			item,
			index,
			handleClick,
			puzzleRef,
		})
	})

	return (
		<PuzzleStyled
			ref={(el) => {
				puzzleRef.current.list = el
			}}
			{...imageInfo}
			columns={columns}
			rows={rows}
		>
			{[...elements]}
		</PuzzleStyled>
	)
}

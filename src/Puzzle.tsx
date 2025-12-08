import styled from "@emotion/styled"
import { useRef } from "react"

import { AppRoute } from "./App"
import { PuzzleItem, getKey } from "./PuzzleItem"
import { clearList } from "./assets/styles/mixins"
import { type PuzzleItemInfo, createLevel, tryMove } from "./game"
import type { ImageInfo } from "./images"
import { levels } from "./levels"

const PuzzleStyled = styled.ul<{
	ssWidth: number
	ssHeight: number
	ratio: number
	columns: number
	rows: number
	image: string
}>(
	({ ssWidth, ssHeight, ratio, columns, rows, image }) => `
		${clearList};

		--ss-width: ${ssWidth};
		--ss-height: ${ssHeight};
		--ratio: ${ratio};
		--columns: ${columns};
		--rows: ${rows};
		--image: url(${image});

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
	levelNumber,
	setLevelNumber,
	setPage,
	imageInfo,
}: {
	levelNumber: number
	setLevelNumber: React.Dispatch<React.SetStateAction<number>>
	setPage: React.Dispatch<React.SetStateAction<AppRoute>>
	imageInfo: ImageInfo
}) {
	const { imageUrl, width, height, ratio } = imageInfo
	const levelConfig = levels[levelNumber - 1]
	const level = createLevel(levelConfig)
	const { items, columns, rows } = level
	const emptyItemInfo = items.find((item) => item.isEmpty) as PuzzleItemInfo
	const puzzleItemsRefs = useRef<Record<string, HTMLLIElement | null>>({})
	const puzzleListRef = useRef<Record<string, HTMLElement | null>>({})

	const checkLevel = () => {
		const isFinished = items.every(
			({ current, original }) =>
				current.row === original.row && current.column === original.column
		)
		if (isFinished) {
			puzzleListRef.current[0]?.classList.add("disabled")
			setTimeout(() => {
				puzzleListRef.current[0]?.classList.add("ready")
				setTimeout(() => {
					setLevelNumber((current) => current + 1)
					setPage(AppRoute.Win)
				}, 2000)
			}, 500)
		}
	}

	const onItemClick = (clickedItemInfo: PuzzleItemInfo) => {
		const isMoved = tryMove(clickedItemInfo, items)
		if (isMoved) {
			;[clickedItemInfo, emptyItemInfo].forEach((info) => {
				const changedElement = puzzleItemsRefs.current[getKey(info.original)]

				if (changedElement) {
					const { row, column } = info.current
					changedElement.style.setProperty("--row", row.toString())
					changedElement.style.setProperty("--col", column.toString())
				}
			})

			checkLevel()
		}
	}

	const elements = items.map((item, index) => {
		return PuzzleItem({
			item,
			index,
			handleClick: () => onItemClick(item),
			refs: puzzleItemsRefs,
		})
	})

	return (
		<PuzzleStyled
			ref={(el) => {
				puzzleListRef.current[0] = el
			}}
			ssWidth={width}
			ssHeight={height}
			ratio={ratio}
			columns={columns}
			rows={rows}
			image={imageUrl}
		>
			{[...elements]}
		</PuzzleStyled>
	)
}

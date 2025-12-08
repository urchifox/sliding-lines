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
	const refs = useRef<Record<string, HTMLLIElement | null>>({})

	const checkLevel = () => {
		const isReady = items.every(
			(item) =>
				item.current.row === item.original.row &&
				item.current.column === item.original.column
		)
		if (isReady) {
			setTimeout(() => {
				for (const item of items) {
					const element = refs.current[getKey(item.original)]
					if (element) {
						element.classList.add("ready")
					}
				}
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
				const changedElement = refs.current[getKey(info.original)]

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
			refs,
		})
	})

	return (
		<PuzzleStyled
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

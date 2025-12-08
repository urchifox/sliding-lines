import styled from "@emotion/styled"
import { useRef, useState } from "react"

import { AppRoute } from "./App"
import { PuzzleItem } from "./PuzzleItem"
import { clearList } from "./assets/styles/mixins"
import { type PuzzleItemInfo, createLevel, tryMove } from "./game"
import { type ImageInfo, getImageInfo } from "./images"
import { levels } from "./levels"

let levelNumber = 1

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
	setPage,
}: {
	setPage: React.Dispatch<React.SetStateAction<AppRoute>>
}) {
	const puzzleItemsRefs = useRef<Record<string, HTMLLIElement | null>>({})
	const puzzleListRef = useRef<Record<string, HTMLElement | null>>({})
	const [imageInfo, setImageInfo] = useState<ImageInfo | null>(null)

	if (imageInfo === null) {
		getImageInfo(levelNumber).then(setImageInfo)
		return <div>Загрузка…</div>
	}

	const levelConfig = levels[levelNumber - 1]
	const level = createLevel(levelConfig)

	const { items, columns, rows, emptySlotIndex } = level
	const emptyItemInfo = items[emptySlotIndex]

	const checkLevel = () => {
		const isFinished = items.every(
			({ current, original }) =>
				current.row === original.row && current.column === original.column
		)
		if (isFinished) {
			const puzzleElement = puzzleListRef.current[0]
			puzzleElement?.classList.add("disabled")
			setTimeout(() => {
				puzzleElement?.classList.add("ready")
				setTimeout(() => {
					levelNumber++
					setPage(AppRoute.Win)
				}, 2000)
			}, 500)
		}
	}

	const onItemClick = (clickedItemInfo: PuzzleItemInfo) => {
		const isMoved = tryMove(clickedItemInfo, items)
		if (isMoved) {
			;[clickedItemInfo, emptyItemInfo].forEach((info) => {
				const changedElement = puzzleItemsRefs.current[info.key]

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
			{...imageInfo}
			columns={columns}
			rows={rows}
		>
			{[...elements]}
		</PuzzleStyled>
	)
}

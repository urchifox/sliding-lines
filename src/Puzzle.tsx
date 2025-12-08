import styled from "@emotion/styled"
import { useEffect, useRef } from "react"

import { AppRoute } from "./App"
import { clearList } from "./assets/styles/mixins"
import { createLevel, tryMove } from "./game"
import type { ImageInfo } from "./images"
import { levels } from "./levels"
import { getKey, PuzzleItem } from "./PuzzleItem"

const PuzzleStyled = styled.ul`
	${clearList}

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
	const refs = useRef<Record<string, HTMLLIElement | null>>({})

	const updateLevel = () => {
		for (const item of items) {
			const element = refs.current[getKey(item.original)]
			if (element) {
				element.style.setProperty("--row", item.current.row.toString())
				element.style.setProperty("--col", item.current.column.toString())
			}
		}
	}

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

	useEffect(updateLevel, [])

	const elements = items.map((item, index) => {
		const handleClick = () => {
			const result = tryMove(item, items)
			if (result) {
				updateLevel()
				checkLevel()
			}
		}

		return PuzzleItem({item, index, handleClick, refs})
	})

	return (
		<PuzzleStyled
			className="puzzle"
			style={
				{
					"--ss-width": width,
					"--ss-height": height,
					"--ratio": ratio,
					"--columns": columns,
					"--rows": rows,
					"--image": `url(${imageUrl})`,
				} as React.CSSProperties
			}
		>
			{[...elements]}
		</PuzzleStyled>
	)
}

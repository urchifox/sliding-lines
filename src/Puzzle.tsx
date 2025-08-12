import { useEffect, useRef } from "react"

import { AppRoute } from "./App"
import "./Puzzle.scss"
import { type Position, createLevel, tryMove } from "./game"
import { levels } from "./levels"

function getKey({ row, column }: Position) {
	return `${row}-${column}`
}

export function Puzzle({
	levelNumber,
	setLevelNumber,
	setPage,
}: {
	levelNumber: number
	setLevelNumber: React.Dispatch<React.SetStateAction<number>>
	setPage: React.Dispatch<React.SetStateAction<AppRoute>>
}) {
	const levelConfig = levels[levelNumber]
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
						element.classList.remove("puzzle__item--empty")
						element.classList.add("puzzle__item--ready")
					}
				}
			}, 500)
		}
		return isReady
	}

	useEffect(updateLevel, [])

	const elements = items.map((item, index) => {
		const { current, original, isEmpty } = item

		const handleClick = () => {
			const result = tryMove(item, items)
			if (result) {
				updateLevel()
				const isWin = checkLevel()
				if (isWin) {
					setLevelNumber((current) => current++)
					setPage(AppRoute.Win)
				}
			}
		}

		const key = getKey(original)

		return (
			<li
				className={`puzzle__item ${isEmpty ? "puzzle__item--empty" : ""}`}
				ref={(el) => {
					refs.current[key] = el
				}}
				key={key}
				onClick={handleClick}
				style={
					{
						"--row": current.row,
						"--col": current.column,
					} as React.CSSProperties
				}
			>
				{`${index + 1} (${key})`}
			</li>
		)
	})

	return (
		<ul
			className="puzzle"
			style={
				{
					"--columns": columns,
					"--rows": rows,
				} as React.CSSProperties
			}
		>
			{[...elements]}
		</ul>
	)
}

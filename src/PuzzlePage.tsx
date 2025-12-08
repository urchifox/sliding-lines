import { useRef, useState } from "react"

import { AppRoute } from "./App"
import { Puzzle } from "./Puzzle"
import { createLevel } from "./game"
import { type ImageInfo, getImageInfo } from "./images"
import { levels } from "./levels"

let levelNumber = 1

export function PuzzlePage({
	setPage,
}: {
	setPage: React.Dispatch<React.SetStateAction<AppRoute>>
}) {
	const [imageInfo, setImageInfo] = useState<ImageInfo | null>(null)
	const puzzleRef = useRef<Record<string, HTMLElement | null>>({})

	if (imageInfo === null) {
		getImageInfo(levelNumber).then(setImageInfo)
		return (
			<section>
				<p>Загрузка…</p>
			</section>
		)
	}

	const levelConfig = levels[levelNumber - 1]
	const level = createLevel(levelConfig)

	const checkLevel = () => {
		const isFinished = level.items.every(
			({ current, original }) =>
				current.row === original.row && current.column === original.column
		)
		if (isFinished) {
			const puzzleElement = puzzleRef.current.list
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

	return (
		<section>
			<Puzzle
				level={level}
				imageInfo={imageInfo}
				checkLevel={checkLevel}
				puzzleRef={puzzleRef}
			/>
		</section>
	)
}

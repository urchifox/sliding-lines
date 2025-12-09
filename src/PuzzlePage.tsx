import { useRef, useState } from "react"

import { AppRoute } from "./App"
import { Puzzle } from "./Puzzle"
import { createLevel } from "./game"
import { type ImageInfo, getImageInfo } from "./images"
import { PageStyled } from "./Page"

let levelNumber = 0

export function PuzzlePage({
	setPage,
}: {
	setPage: React.Dispatch<React.SetStateAction<AppRoute>>
}) {
	const [imageInfo, setImageInfo] = useState<ImageInfo | null>(null)
	const [isDisabled, setDisabledState] = useState<boolean>(false)
	const [isFinished, setFinishedState] = useState<boolean>(false)
	const level = useRef(createLevel(levelNumber)).current

	if (imageInfo === null) {
		getImageInfo(levelNumber).then(setImageInfo)

		return (
			<section>
				<p>Загрузка…</p>
			</section>
		)
	}

	const onCompleteLevel = () => {
		setDisabledState(true)

		setTimeout(() => {
			setFinishedState(true)

			setTimeout(() => {
				levelNumber++
				setPage(AppRoute.Win)
			}, 2000)
		}, 500)
	}

	return (
		<PageStyled>
			<Puzzle
				level={level}
				imageInfo={imageInfo}
				onCompleteLevel={onCompleteLevel}
				isDisabled={isDisabled}
				isFinished={isFinished}
			/>
		</PageStyled>
	)
}

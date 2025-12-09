import { useState } from "react"

import { AppRoute } from "./App"
import { PageStyled } from "./Page"
import { Puzzle } from "./Puzzle"
import { upgradeLevel } from "./game"
import { type ImageInfo, getImageInfo } from "./images"

export function PuzzlePage({
	setPage,
}: {
	setPage: React.Dispatch<React.SetStateAction<AppRoute>>
}) {
	const [imageInfo, setImageInfo] = useState<ImageInfo | null>(null)
	const [isDisabled, setDisabledState] = useState<boolean>(false)
	const [isFinished, setFinishedState] = useState<boolean>(false)

	if (imageInfo === null) {
		getImageInfo().then(setImageInfo)

		return (
			<PageStyled>
				<p>Загрузка…</p>
			</PageStyled>
		)
	}

	const onCompleteLevel = () => {
		setDisabledState(true)

		setTimeout(() => {
			setFinishedState(true)

			setTimeout(() => {
				upgradeLevel()
				setPage(AppRoute.Win)
			}, 2000)
		}, 500)
	}

	return (
		<PageStyled>
			<Puzzle
				imageInfo={imageInfo}
				onCompleteLevel={onCompleteLevel}
				isDisabled={isDisabled}
				isFinished={isFinished}
			/>
		</PageStyled>
	)
}

import { useEffect, useState } from "react"

import { Puzzle } from "./Puzzle"
import { StartPage } from "./StartPage"
import { WinPage } from "./WinPage"
import { createLevel } from "./game"
import { type ImageInfo, getImageInfo } from "./images"
import { levels } from "./levels"

export enum AppRoute {
	Start,
	Game,
	Win,
}

export function App() {
	const [page, setPage] = useState<AppRoute>(AppRoute.Start)
	const [levelNumber, setLevelNumber] = useState(1)
	const [imageInfo, setImageInfo] = useState<ImageInfo | null>(null)
	useEffect(() => {
		getImageInfo(levelNumber).then(setImageInfo)
	}, [levelNumber])

	const getPage = (page: AppRoute) => {
		switch (page) {
			case AppRoute.Start:
				return <StartPage {...{ setPage }} />
			case AppRoute.Game:
				const levelConfig = levels[levelNumber - 1]
				const level = createLevel(levelConfig)

				return imageInfo === null ? (
					<div>Загрузка…</div>
				) : (
					<Puzzle {...{ level, setLevelNumber, setPage, imageInfo }} />
				)
			case AppRoute.Win:
				return <WinPage {...{ setPage }} />
			default:
				return null
		}
	}

	return getPage(page)
}

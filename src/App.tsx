import { useState } from "react"

import "./App.scss"
import { Puzzle } from "./Puzzle"
import { StartPage } from "./StartPage"
import { createLevel } from "./game"
import { levels } from "./levels"
import { WinPage } from "./WinPage"

export enum AppRoute {
	Start,
	Game,
	Win,
}

export function App() {
	const [page, setPage] = useState<AppRoute>(AppRoute.Start)
	const [levelNumber, setLevelNumber] = useState(0)

	const levelConfig = levels[levelNumber]
	const level = createLevel(levelConfig)

	const getPage = (page: AppRoute) => {
		switch (page) {
			case AppRoute.Start:
				return <StartPage {...{ setPage }} />
			case AppRoute.Game:
				return <Puzzle {...{ level, setLevelNumber, setPage }} />
			case AppRoute.Win:
				return <WinPage {...{ setPage }} />
			default:
				return null
		}
	}

	return getPage(page)
}

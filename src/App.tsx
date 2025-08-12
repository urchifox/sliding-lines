import { useState } from "react"

import "./App.scss"
import { Puzzle } from "./Puzzle"
import { createLevel } from "./game"
import { levels } from "./levels"

export enum AppRoute {
	Game,
}

export function App() {
	const [page, setPage] = useState<AppRoute>(AppRoute.Game)
	const [levelNumber, setLevelNumber] = useState(0)

	const levelConfig = levels[levelNumber]
	const level = createLevel(levelConfig)

	const getPage = (page: AppRoute) => {
		switch (page) {
			case AppRoute.Game:
				return <Puzzle {...{ level, setLevelNumber, setPage }} />
			default:
				return null
		}
	}

	return getPage(page)
}

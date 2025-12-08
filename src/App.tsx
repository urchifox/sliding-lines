import { useState } from "react"

import { StartPage } from "./StartPage"
import { WinPage } from "./WinPage"
import { PuzzlePage } from "./PuzzlePage"

export enum AppRoute {
	Start,
	Game,
	Win,
}

export function App() {
	const [page, setPage] = useState<AppRoute>(AppRoute.Start)

	switch (page) {
		case AppRoute.Start:
			return <StartPage {...{ setPage }} />
		case AppRoute.Game:
			return <PuzzlePage {...{ setPage }} />
		case AppRoute.Win:
			return <WinPage {...{ setPage }} />
		default:
			return null
	}
}

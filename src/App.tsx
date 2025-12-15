import { useState } from "react"

import { PuzzlePage } from "./PuzzlePage"
import { StartPage } from "./StartPage"

export enum AppRoute {
	Start,
	Game,
}

export function App() {
	const [page, setPage] = useState<AppRoute>(AppRoute.Start)

	switch (page) {
		case AppRoute.Start:
			return <StartPage {...{ setPage }} />
		case AppRoute.Game:
			return <PuzzlePage />
		default:
			return null
	}
}

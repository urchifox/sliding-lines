import { useState } from "react"

import { AppRoute } from "./AppRoute"
import { PuzzlePage } from "./PuzzlePage"
import { StartPage } from "./StartPage"

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

import { useState } from "react"
import "./App.scss"
import { Puzzle } from "./Puzzle"
import { createLevel } from "./game"
import { levels } from "./levels"

export function App() {
	const [levelNumber, setLevelNumber] = useState(0)

	const levelConfig = levels[levelNumber]
	const level = createLevel(levelConfig)

	return (
		<>
			<Puzzle {...{ level, setLevelNumber }} />
		</>
	)
}

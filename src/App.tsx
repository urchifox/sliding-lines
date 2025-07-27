import "./App.scss"
import { Puzzle } from "./Puzzle"
import { type LevelConfig, createLevel } from "./game"

export function App() {
	const levelConfig: LevelConfig = {
		columns: 5,
		rows: 3,
		shuffleSteps: { min: 2, max: 2 },
	}
	const level = createLevel(levelConfig)

	return (
		<>
			<Puzzle {...{ level }} />
		</>
	)
}

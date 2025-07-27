import "./App.scss"
import { Puzzle } from "./Puzzle"
import { type LevelConfig, createLevel } from "./game"

export function App() {
	const levelConfig: LevelConfig = {
		columns: 3,
		rows: 3,
		shuffleSteps: { min: 3, max: 10 },
	}
	const level = createLevel(levelConfig)

	return (
		<>
			<Puzzle {...{ level }} />
		</>
	)
}

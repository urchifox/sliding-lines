import { AppRoute } from "./App"
import { Button } from "./Button"

export function WinPage({
	setPage,
}: {
	setPage: React.Dispatch<React.SetStateAction<AppRoute>>
}) {
	const handleStartClick = () => {
		setPage(AppRoute.Game)
	}

	return (
		<section>
			<h1>Вы выиграли!</h1>
			<Button onClick={handleStartClick} text="Сыграть еще"/>
		</section>
	)
}

import { AppRoute } from "./App"
import { Button } from "./Button"

export function StartPage({
	setPage,
}: {
	setPage: React.Dispatch<React.SetStateAction<AppRoute>>
}) {
	const handleStartClick = () => {
		setPage(AppRoute.Game)
	}

	return (
		<section>
			<Button onClick={handleStartClick} text="Играть" />
		</section>
	)
}

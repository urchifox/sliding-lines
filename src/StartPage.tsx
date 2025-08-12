import { AppRoute } from "./App"

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
			<button onClick={handleStartClick}>Играть</button>
		</section>
	)
}

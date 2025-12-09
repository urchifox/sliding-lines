import { AppRoute } from "./App"
import { Button } from "./Button"
import { PageStyled } from "./Page"

export function StartPage({
	setPage,
}: {
	setPage: React.Dispatch<React.SetStateAction<AppRoute>>
}) {
	const handleStartClick = () => {
		setPage(AppRoute.Game)
	}

	return (
		<PageStyled>
			<Button onClick={handleStartClick} text="Играть" />
		</PageStyled>
	)
}

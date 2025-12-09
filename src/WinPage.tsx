import { AppRoute } from "./App"
import { Button } from "./Button"
import { HeaderStyled } from "./Header"
import { PageStyled } from "./Page"

export function WinPage({
	setPage,
}: {
	setPage: React.Dispatch<React.SetStateAction<AppRoute>>
}) {
	const handleStartClick = () => {
		setPage(AppRoute.Game)
	}

	return (
		<PageStyled>
			<HeaderStyled>You have won!</HeaderStyled>
			<Button onClick={handleStartClick} text="Solve next puzzle" />
		</PageStyled>
	)
}

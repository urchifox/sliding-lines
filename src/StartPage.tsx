import styled from "@emotion/styled"

import { AppRoute } from "./App"
import { Button } from "./Button"
import { HeaderStyled } from "./Header"
import { LinkStyled } from "./Link"
import { PageStyled } from "./Page"
import { TextStyled } from "./Text"
import { Lines } from "./Lines"

const StartPageStyled = styled(PageStyled)`
	grid-template-rows: repeat(3, auto);
`

const HeaderWithLinesStyled = styled.div`
	width: fit-content;
`

export function StartPage({
	setPage,
}: {
	setPage: React.Dispatch<React.SetStateAction<AppRoute>>
}) {
	const handleStartClick = () => {
		setPage(AppRoute.Game)
	}

	return (
		<StartPageStyled>
			<HeaderWithLinesStyled>
				<HeaderStyled marginBottom={"0.5em"}>Sliding Lines</HeaderStyled>
				<Lines />
			</HeaderWithLinesStyled>
			<TextStyled>
				A small game by{" "}
				<LinkStyled href="https://github.com/urchifox">urchifox</LinkStyled>{" "}
				with arts from{" "}
				<LinkStyled href="https://www.instagram.com/playful.lines/">
					playful.lines
				</LinkStyled>
			</TextStyled>
			<Button onClick={handleStartClick} text="Play" />
		</StartPageStyled>
	)
}

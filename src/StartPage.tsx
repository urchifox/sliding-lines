import styled from "@emotion/styled"
import { useState } from "react"

import { AppRoute } from "./App"
import { ButtonWithTextStyled } from "./Button"
import { HeaderStyled } from "./Header"
import { Lines } from "./Lines"
import { LinkStyled } from "./Link"
import { PageStyled } from "./Page"
import { TextStyled } from "./Text"

const StartPageStyled = styled(PageStyled)`
	grid-template-rows: repeat(3, auto);
`

const HeaderWithLinesStyled = styled.div`
	width: fit-content;
`

const StartHeader = styled(HeaderStyled)<{
	isUpdating: boolean
}>(({ isUpdating }) => {
	return `
	animation: ${isUpdating ? "slide-out-to-right" : "slide-in-from-left"} 1s 0.3s ease both;
`
})

const PlayButton = styled(ButtonWithTextStyled)<{
	isUpdating: boolean
}>(({ isUpdating }) => {
	return `
	animation: ${isUpdating ? "slide-out-to-left" : "slide-in-from-right"} 1s 0.3s ease both;
`
})

const StartText = styled(TextStyled)<{
	isUpdating: boolean
}>(({ isUpdating }) => {
	return `
	animation:${isUpdating ? "disappear" : "appear"} 1s 0.3s ease both;
`
})

export function StartPage({
	setPage,
}: {
	setPage: React.Dispatch<React.SetStateAction<AppRoute>>
}) {
	const [isUpdating, setUpdateState] = useState<boolean>(false)

	const handleStartClick = () => {
		setUpdateState(true)
		setTimeout(() => {
			setPage(AppRoute.Game)
		}, 1 * 1000)
	}

	return (
		<StartPageStyled>
			<HeaderWithLinesStyled>
				<StartHeader isUpdating={isUpdating} marginBottom={"0.5em"}>
					Sliding Lines
				</StartHeader>
				<Lines />
			</HeaderWithLinesStyled>
			<StartText isUpdating={isUpdating}>
				A small game by{" "}
				<LinkStyled href="https://github.com/urchifox">urchifox</LinkStyled>{" "}
				with arts from{" "}
				<LinkStyled href="https://www.instagram.com/playful.lines/">
					playful.lines
				</LinkStyled>
			</StartText>
			<PlayButton isUpdating={isUpdating} onClick={handleStartClick}>
				Play
			</PlayButton>
		</StartPageStyled>
	)
}

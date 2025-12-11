import styled from "@emotion/styled"
import { useState } from "react"

import { AppRoute } from "./App"
import { Button } from "./Button"
import { HeaderStyled } from "./Header"
import { PageStyled } from "./Page"
import { getLevelNumber } from "./game"
import { type ImageInfo, getImageInfo } from "./images"

const WinPageStyled = styled(PageStyled)<{ background: string }>(({
	background,
}) => {
	return `
		background-image: url(${background});
		background-repeat: no-repeat;
		background-position: center;
		background-size: contain;
	`
})

export function WinPage({
	setPage,
}: {
	setPage: React.Dispatch<React.SetStateAction<AppRoute>>
}) {
	const [imageInfo, setImageInfo] = useState<ImageInfo | null>(null)
	if (imageInfo === null) {
		getImageInfo(getLevelNumber() - 1).then(setImageInfo)
	}

	const handleStartClick = () => {
		setPage(AppRoute.Game)
	}

	return (
		<WinPageStyled background={imageInfo?.imageUrl ?? ""}>
			<HeaderStyled>You have won!</HeaderStyled>
			<Button onClick={handleStartClick} text="Solve next puzzle" />
		</WinPageStyled>
	)
}

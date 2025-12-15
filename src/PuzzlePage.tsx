import styled from "@emotion/styled"
import { useState } from "react"

import { ButtonStyled } from "./Button"
import { HeaderStyled } from "./Header"
import { PageStyled } from "./Page"
import { Puzzle } from "./Puzzle"
import { TextStyled } from "./Text"
import { theme } from "./assets/styles/theme"
import { upgradeLevel } from "./game"
import { type ImageInfo, getImageInfo } from "./images"

const WinHeader = styled(HeaderStyled)<{
	isFinished: boolean
	isUpdating: boolean
}>(({ isFinished, isUpdating }) => {
	return `
	position: absolute;
	z-index: 1;
	top: 1em;
	display: ${isFinished || isUpdating ? "block" : "none"};

	animation: ${isFinished ? "slide-in-from-left" : isUpdating ? "slide-out-to-right" : "none"} 1s 0.3s ease both;
	animation-fill-mode: both;
`
})

const PlayButton = styled(ButtonStyled)<{
	isFinished: boolean
	isUpdating: boolean
}>(({ isFinished, isUpdating }) => {
	return `
	position: absolute;
	z-index: 1;
	bottom: 1em;
	display: ${isFinished || isUpdating ? "block" : "none"};

	animation: ${isFinished ? "slide-in-from-right" : isUpdating ? "slide-out-to-left" : "none"} 1s 0.3s ease both;
`
})

export function PuzzlePage() {
	const [imageInfo, setImageInfo] = useState<ImageInfo | null>(null)
	const [isDisabled, setDisabledState] = useState<boolean>(false)
	const [isFinished, setFinishedState] = useState<boolean>(false)
	const [isUpdating, setUpdateState] = useState<boolean>(false)

	if (imageInfo === null) {
		getImageInfo().then(setImageInfo)

		return (
			<PageStyled>
				<TextStyled color={theme.color.secondary}>Loading…</TextStyled>
			</PageStyled>
		)
	}

	const onCompleteLevel = () => {
		setDisabledState(true)

		setTimeout(() => {
			setFinishedState(true)
			upgradeLevel()
		}, 500)
	}

	const handleStartClick = () => {
		setFinishedState(false)
		setUpdateState(true)
		setTimeout(() => {
			setImageInfo(null)
			setUpdateState(false)
			setDisabledState(false)
		}, 1 * 1000)
	}

	return (
		<PageStyled>
			<WinHeader isFinished={isFinished} isUpdating={isUpdating}>
				You have won!
			</WinHeader>
			<Puzzle
				imageInfo={imageInfo}
				onCompleteLevel={onCompleteLevel}
				isDisabled={isDisabled}
				isFinished={isFinished}
				isUpdating={isUpdating}
			/>
			<PlayButton
				isFinished={isFinished}
				isUpdating={isUpdating}
				onClick={handleStartClick}
			>
				Solve next puzzle
			</PlayButton>
		</PageStyled>
	)
}

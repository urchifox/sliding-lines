import styled from "@emotion/styled"
import { useState } from "react"

import { HeaderStyled } from "./Header"
import { PageStyled } from "./Page"
import { Puzzle } from "./Puzzle"
import { TextStyled } from "./Text"
import { theme } from "./assets/styles/theme"
import { upgradeLevel } from "./game"
import { type ImageInfo, getImageInfo } from "./images"
import { ButtonStyled } from "./Button"



const WinHeader = styled(HeaderStyled)<{ isFinished: boolean }>(({
	isFinished,
}) => {
	return `
	position: absolute;
	z-index: 1;
	top: 1em;
	display: ${isFinished ? "block" : "none"};

	animation: ${isFinished ? "appear-header" : "none"} 1s 0.3s ease;
	animation-fill-mode: both;

	@keyframes appear-header {
		from {
			opacity: 0;
			transform: translateX(-1em);
		}
		to {
			opacity: 1;
			transform: translateX(0);
		}
	}

	@keyframes disappear-header {
		from {
			opacity: 1;
			transform: translateX(0);
		}
		to {
			opacity: 0;
			transform: translateX(-1em);
		}
	}
`
})

const PlayButton = styled(ButtonStyled)<{ isFinished: boolean }>(({ isFinished }) => {
	return `
	position: absolute;
	z-index: 1;
	bottom: 1em;
	display: ${isFinished ? "block" : "none"};

	animation: ${isFinished ? "appear-button" : "none"} 1s 0.3s ease;
	animation-fill-mode: both;
	
	@keyframes appear-button {
		from {
			opacity: 0;
			transform: translateX(1em);
		}
		to {
			opacity: 1;
			transform: translateX(0);
		}
	}

	@keyframes disappear-header {
		from {
			opacity: 1;
			transform: translateX(0);
		}
		to {
			opacity: 0;
			transform: translateX(1em);
		}
	}
`
})

export function PuzzlePage() {
	const [imageInfo, setImageInfo] = useState<ImageInfo | null>(null)
	const [isDisabled, setDisabledState] = useState<boolean>(false)
	const [isFinished, setFinishedState] = useState<boolean>(false)

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
		setImageInfo(null)
		setDisabledState(false)
		setFinishedState(false)
	}

	return (
		<PageStyled>
			<WinHeader isFinished={isFinished}>You have won!</WinHeader>
			<Puzzle
				imageInfo={imageInfo}
				onCompleteLevel={onCompleteLevel}
				isDisabled={isDisabled}
				isFinished={isFinished}
			/>
			<PlayButton
				isFinished={isFinished}
				onClick={handleStartClick}
			>Solve next puzzle</PlayButton>
		</PageStyled>
	)
}

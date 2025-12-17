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

const LoadingText = styled(TextStyled)`
	animation: appear 1s 0.3s ease both;
`

const PageWrapper = styled.section`
	display: grid;
	grid-template-columns: 1fr;
	grid-template-rows: 1fr;
	justify-items: center;
`

const WinHeader = styled(HeaderStyled)<{
	isFinished: boolean
	isUpdating: boolean
}>(({ isFinished, isUpdating }) => {
	return `
	grid-column: 1 / -1;
	grid-row: 1 / -1;
	z-index: 1;
	display: ${isFinished || isUpdating ? "block" : "none"};

	animation: ${isFinished ? "slide-in-from-left" : isUpdating ? "slide-out-to-right" : "none"} 1s 0.3s ease both;
`
})

const PlayButton = styled(ButtonStyled)<{
	isFinished: boolean
	isUpdating: boolean
}>(({ isFinished, isUpdating }) => {
	return `
	grid-column: 1 / -1;
	grid-row: 1 / -1;
	align-self: end;
	z-index: 1;
	display: ${isFinished || isUpdating ? "block" : "none"};

	animation: ${isFinished ? "slide-in-from-right" : isUpdating ? "slide-out-to-left" : "none"} 1s 0.3s ease both;
`
})

const PuzzleWrapper = styled.div`
	grid-column: 1 / -1;
	grid-row: 1 / -1;
`

export function PuzzlePage() {
	const [imageInfo, setImageInfo] = useState<ImageInfo | null>(null)
	const [isDisabled, setDisabledState] = useState<boolean>(false)
	const [isFinished, setFinishedState] = useState<boolean>(false)
	const [isUpdating, setUpdateState] = useState<boolean>(false)
	const [isError, setError] = useState<boolean>(false)

	if (imageInfo === null) {
		getImageInfo()
			.then((value) => {
				setImageInfo(value)
			})
			.catch(() => {
				setError(true)
			})

		return (
			<PageStyled>
				<LoadingText color={theme.color.secondary}>
					{isError ? "An error occured, try to reload the page" : "Loading…"}
				</LoadingText>
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
			<PageWrapper>
				<WinHeader isFinished={isFinished} isUpdating={isUpdating}>
					You have won!
				</WinHeader>
				<PuzzleWrapper>
					<Puzzle
						imageInfo={imageInfo}
						onCompleteLevel={onCompleteLevel}
						isDisabled={isDisabled}
						isFinished={isFinished}
						isUpdating={isUpdating}
					/>
				</PuzzleWrapper>
				<PlayButton
					isFinished={isFinished}
					isUpdating={isUpdating}
					onClick={handleStartClick}
				>
					Solve next puzzle
				</PlayButton>
			</PageWrapper>
		</PageStyled>
	)
}

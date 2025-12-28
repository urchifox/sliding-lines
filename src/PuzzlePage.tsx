import replayIcon from "./assets/images/replay.svg"

import styled from "@emotion/styled"
import { useState } from "react"

import { ButtonIconStyled, ButtonWithTextStyled } from "./Button"
import { HeaderStyled } from "./Header"
import { PageStyled } from "./Page"
import { Puzzle } from "./Puzzle"
import { TextStyled } from "./Text"
import { theme } from "./assets/styles/theme"
import { getLevelNumber, upgradeLevel } from "./game"
import { type ImageInfo, getImageInfo } from "./images"

const LoadingText = styled(TextStyled)`
	animation: appear 1s 0.3s ease both;
`

const PuzzlePageStyled = styled(PageStyled)`
	--padding-block: ${theme.fontSize.l};
	--padding-inline: ${theme.fontSize.xl};
	--extreme-rows-height: ${theme.fontSize.l};
	--max-puzzle-width: calc(min(${theme.maxWidth}, 100vw) - var(--padding-inline) * 2);
	--max-puzzle-height: calc(
		100vh - var(--padding-block) * 2 - var(--gap) *
			2 - var(--extreme-rows-height) * 2
	);
	--gap: 1em;

	padding-block: var(--padding-block);
	padding-inline: var(--padding-inline);

	grid-template-columns: 1fr auto;
	grid-template-rows: var(--extreme-rows-height) 1fr var(--extreme-rows-height);
	gap: var(--gap);
`

const LevelName = styled(TextStyled)<{ isUpdating: boolean }>(
	({ isUpdating }) => `
	margin: 0;
	grid-column: 1 / 2;
	grid-row: 1 / 2;
	justify-self: start;
	align-self: center;

	font-size: ${theme.fontSize.l};

	opacity: ${isUpdating ? 0 : 1};
	transition: opacity 0.3s ease;
`
)

const RestartButton = styled(ButtonIconStyled)<{ isUpdating: boolean }>(
	({ isUpdating }) => `
	grid-column: 2 / 3;
	grid-row: 1 / 2;
	justify-self: end;

	mask-image: url(${replayIcon});

	opacity: ${isUpdating ? 0 : 1};
	transition: opacity 0.3s ease;
`
)

const WinHeader = styled(HeaderStyled)<{
	isFinished: boolean
	isUpdating: boolean
}>(({ isFinished, isUpdating }) => {
	return `
	grid-column: 1 / -1;
	grid-row: 2 / 3;
	z-index: 1;
	align-self: start;
	display: ${isFinished || isUpdating ? "block" : "none"};

	animation: ${isFinished ? "slide-in-from-left" : isUpdating ? "slide-out-to-right" : "none"} 1s 0.3s ease both;
`
})

const PlayButton = styled(ButtonWithTextStyled)<{
	isFinished: boolean
	isUpdating: boolean
}>(({ isFinished, isUpdating }) => {
	return `
	grid-column: 1 / -1;
	grid-row: 2 / 3;
	align-self: end;
	z-index: 1;
	display: ${isFinished || isUpdating ? "block" : "none"};

	animation: ${isFinished ? "slide-in-from-right" : isUpdating ? "slide-out-to-left" : "none"} 1s 0.3s ease both;
`
})

const PuzzleWrapper = styled.div`
	grid-column: 1 / -1;
	grid-row: 2 / 3;
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

	const handleRestrartClick = () => {
		setImageInfo(null)
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
		<PuzzlePageStyled>
			<LevelName isUpdating={isUpdating}>Level {getLevelNumber()}</LevelName>
			<RestartButton onClick={handleRestrartClick} isUpdating={isUpdating} />
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
		</PuzzlePageStyled>
	)
}

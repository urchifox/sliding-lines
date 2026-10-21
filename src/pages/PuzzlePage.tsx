import replayIcon from "../assets/images/replay.svg"

import styled from "@emotion/styled"
import { useEffect, useState } from "react"

import { theme } from "../assets/styles/theme"
import { Puzzle } from "../puzzle/components/Puzzle"
import { createPuzzle } from "../puzzle/domain/game"
import { type ImageInfo, getImageInfo } from "../puzzle/domain/images"
import { resetLevel, shuffleLevel } from "../puzzle/domain/level"
import { ButtonIconStyled, ButtonWithTextStyled } from "../ui/Button"
import { HeaderStyled } from "../ui/Header"
import { PageStyled } from "../ui/Page"
import { TextStyled } from "../ui/Text"

const LoadingText = styled(TextStyled)`
	animation: appear 1s 0.3s ease both;
`

const PuzzlePageStyled = styled(PageStyled)`
	--padding-block: ${theme.fontSize.l};
	--padding-inline: ${theme.fontSize.xl};
	--extreme-rows-height: ${theme.fontSize.l};
	--max-puzzle-width: calc(
		min(${theme.maxWidth}, 100vw) - var(--padding-inline) * 2
	);
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

const RestartButton = styled(ButtonIconStyled)<{
	isFinished: boolean
	isUpdating: boolean
}>(
	({ isFinished, isUpdating }) => `
	grid-column: 2 / 3;
	grid-row: 1 / 2;
	justify-self: end;

	mask-image: url(${replayIcon});

	opacity: ${isFinished || isUpdating ? 0 : 1};
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
	const [puzzle, setPuzzle] = useState(createPuzzle)
	const [boardVersion, setBoardVersion] = useState(0)
	const [imageInfo, setImageInfo] = useState<ImageInfo | null>(null)
	const [isDisabled, setDisabledState] = useState<boolean>(false)
	const [isFinished, setFinishedState] = useState<boolean>(false)
	const [isUpdating, setUpdateState] = useState<boolean>(false)
	const [isError, setError] = useState<boolean>(false)

	useEffect(() => {
		if (imageInfo !== null) {
			return
		}

		let cancelled = false
		getImageInfo()
			.then((value) => {
				if (!cancelled) {
					setImageInfo(value)
				}
			})
			.catch(() => {
				if (!cancelled) {
					setError(true)
				}
			})

		return () => {
			cancelled = true
		}
	}, [imageInfo])

	if (imageInfo === null) {
		return (
			<PageStyled>
				<LoadingText color={theme.color.secondary}>
					{isError ? "An error occurred, try to reload the page" : "Loading…"}
				</LoadingText>
			</PageStyled>
		)
	}

	const onCompleteLevel = () => {
		setDisabledState(true)

		setTimeout(() => {
			setFinishedState(true)
		}, 500)
	}

	const handleRestartClick = () => {
		if (isFinished || isUpdating) {
			return
		}
		resetLevel(puzzle.level)
		shuffleLevel(puzzle.level)
		setBoardVersion((version) => version + 1)
		setFinishedState(false)
		setDisabledState(false)
	}

	const handleStartClick = () => {
		if (isUpdating) {
			return
		}
		setFinishedState(false)
		setUpdateState(true)
		setTimeout(() => {
			setPuzzle(createPuzzle())
			setImageInfo(null)
			setUpdateState(false)
			setDisabledState(false)
		}, 1 * 1000)
	}

	// Progress stores how many levels are finished, starting at 0.
	const visualLevelNumber = puzzle.levelNumber + 1

	return (
		<PuzzlePageStyled>
			<LevelName isUpdating={isUpdating}>Level {visualLevelNumber}</LevelName>
			<RestartButton
				onClick={handleRestartClick}
				isFinished={isFinished}
				isUpdating={isUpdating}
				disabled={isFinished || isUpdating}
			/>
			<WinHeader isFinished={isFinished} isUpdating={isUpdating}>
				You have won!
			</WinHeader>
			<PuzzleWrapper>
				<Puzzle
					key={boardVersion}
					imageInfo={imageInfo}
					onCompleteLevel={onCompleteLevel}
					isDisabled={isDisabled}
					isFinished={isFinished}
					isUpdating={isUpdating}
					level={puzzle.level}
				/>
			</PuzzleWrapper>
			<PlayButton
				isFinished={isFinished}
				isUpdating={isUpdating}
				disabled={isUpdating}
				onClick={handleStartClick}
			>
				Solve next puzzle
			</PlayButton>
		</PuzzlePageStyled>
	)
}

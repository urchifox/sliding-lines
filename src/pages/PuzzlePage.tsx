import replayIcon from "../assets/images/replay.svg"

import styled from "@emotion/styled"
import { useEffect, useState } from "react"

import { theme } from "../assets/styles/theme"
import { Puzzle } from "../puzzle/components/Puzzle"
import { restartLevel } from "../puzzle/domain/level"
import { createPuzzleData } from "../puzzle/domain/puzzleData"
import type { BoardState, PuzzleData } from "../puzzle/domain/types"
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

const LevelName = styled(TextStyled)<BoardState>(
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

const RestartButton = styled(ButtonIconStyled)<BoardState>(
	({ isFinished }) => `
	grid-column: 2 / 3;
	grid-row: 1 / 2;
	justify-self: end;

	mask-image: url(${replayIcon});

	opacity: ${isFinished ? 0 : 1};
	transition: opacity 0.3s ease;
`
)

const WinHeader = styled(HeaderStyled)<BoardState>(({
	isFinished,
	isUpdating,
}) => {
	return `
	grid-column: 1 / -1;
	grid-row: 2 / 3;
	z-index: 1;
	align-self: start;
	display: ${isFinished ? "block" : "none"};

	animation: ${isUpdating ? "slide-out-to-right" : isFinished ? "slide-in-from-left" : "none"} 1s 0.3s ease both;
`
})

const PlayButton = styled(ButtonWithTextStyled)<BoardState>(({
	isFinished,
	isUpdating,
}) => {
	return `
	grid-column: 1 / -1;
	grid-row: 2 / 3;
	align-self: end;
	z-index: 1;
	display: ${isFinished ? "block" : "none"};

	animation: ${isUpdating ? "slide-out-to-left" : isFinished ? "slide-in-from-right" : "none"} 1s 0.3s ease both;
`
})

const PuzzleWrapper = styled.div`
	grid-column: 1 / -1;
	grid-row: 2 / 3;
`

export function PuzzlePage() {
	const [puzzleData, setPuzzleData] = useState<PuzzleData | null>(null)
	const [boardVersion, setBoardVersion] = useState(0)
	const [isFinished, setFinishedState] = useState<boolean>(false)
	const [isUpdating, setUpdateState] = useState<boolean>(false)
	const [isError, setError] = useState<boolean>(false)

	const boardState: BoardState = isFinished
		? { isFinished: true as const, isUpdating }
		: { isFinished: false as const, isUpdating: false as const }

	useEffect(() => {
		if (puzzleData !== null) {
			return
		}

		let cancelled = false
		createPuzzleData()
			.then((value) => {
				if (!cancelled) {
					setPuzzleData(value)
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
	}, [puzzleData])

	if (puzzleData === null) {
		return (
			<PageStyled>
				<LoadingText color={theme.color.secondary}>
					{isError ? "An error occurred, try to reload the page" : "Loading…"}
				</LoadingText>
			</PageStyled>
		)
	}

	const onCompleteLevel = () => {
		setFinishedState(true)
	}

	const handleRestartClick = () => {
		if (boardState.isFinished) {
			return
		}
		restartLevel(puzzleData.level)
		setBoardVersion((version) => version + 1)
		setFinishedState(false)
	}

	const handleStartClick = () => {
		if (!boardState.isFinished) {
			return
		}
		setUpdateState(true)
		setTimeout(() => {
			setPuzzleData(null)
			setUpdateState(false)
			setFinishedState(false)
		}, 1 * 1000)
	}

	// Progress stores how many levels are finished, starting at 0.
	const visualLevelNumber = puzzleData.levelNumber + 1

	return (
		<PuzzlePageStyled>
			<LevelName {...boardState}>Level {visualLevelNumber}</LevelName>
			<RestartButton
				aria-label="Restart"
				onClick={handleRestartClick}
				disabled={boardState.isFinished}
				{...boardState}
			/>
			<WinHeader {...boardState}>You have won!</WinHeader>
			<PuzzleWrapper>
				<Puzzle
					key={boardVersion}
					imageInfo={puzzleData.imageInfo}
					onCompleteLevel={onCompleteLevel}
					level={puzzleData.level}
					boardState={boardState}
				/>
			</PuzzleWrapper>
			<PlayButton
				{...boardState}
				disabled={boardState.isUpdating}
				onClick={handleStartClick}
			>
				Solve next puzzle
			</PlayButton>
		</PuzzlePageStyled>
	)
}

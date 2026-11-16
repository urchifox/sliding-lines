import replayIcon from "../assets/images/replay.svg"

import styled from "@emotion/styled"
import { useLayoutEffect, useRef, useState } from "react"

import { theme } from "../assets/styles/theme"
import { useAppDispatch } from "../hooks"
import { useDelay } from "../hooks/delay"
import { useLoadPuzzle } from "../hooks/loadPuzzle"
import { Puzzle } from "../puzzle/components/Puzzle"
import type { BoardState } from "../puzzle/domain/types"
import {
	resetPuzzleDataAction,
	reshuffleTilesAction,
} from "../store/puzzleSlice"
import { ButtonIconStyled, ButtonWithTextStyled } from "../ui/Button"
import { HeaderStyled } from "../ui/Header"
import { PageStyled } from "../ui/Page"
import { TextStyled } from "../ui/Text"
import {
	errorText,
	getLevelNameText,
	loadingText,
	playButtonText,
	restartButtonLabel,
	winHeaderText,
} from "./PuzzlePageHelpers"

const LoadingText = styled(TextStyled)`
	animation: appear 1s 0.3s ease both;
`

const PuzzlePageStyled = styled(PageStyled)`
	--color-focus: ${theme.color.interactive.active};
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
	--mask-image: url(${replayIcon});

	grid-column: 2 / 3;
	grid-row: 1 / 2;
	justify-self: end;

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

	--animation-name: ${isUpdating ? "slide-out-to-right" : isFinished ? "slide-in-from-left" : "none"};
	animation: var(--animation-name) 1s 0.3s ease both;
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

	--animation-name: ${isUpdating ? "slide-out-to-left" : isFinished ? "slide-in-from-right" : "none"};
	animation: var(--animation-name) 1s 0.3s ease both;
`
})

const PuzzleWrapper = styled.div`
	grid-column: 1 / -1;
	grid-row: 2 / 3;
`

export function PuzzlePage() {
	const dispatch = useAppDispatch()
	const { puzzleData, isError } = useLoadPuzzle()
	const [boardVersion, setBoardVersion] = useState(0)
	const { isDelayed: isUpdating, startDelay: stratUpdating } = useDelay()
	const winHeaderRef = useRef<HTMLHeadingElement>(null)
	const isFinished = puzzleData?.isSolved ?? false

	useLayoutEffect(() => {
		if (!isFinished) {
			return
		}

		winHeaderRef.current?.focus()
	}, [isFinished])

	if (puzzleData === null) {
		return (
			<PageStyled>
				<LoadingText color={theme.color.secondary}>
					{isError ? errorText : loadingText}
				</LoadingText>
			</PageStyled>
		)
	}

	const onRestartClick = () => {
		if (isFinished) {
			return
		}

		dispatch(reshuffleTilesAction())
		setBoardVersion((version) => version + 1)
	}

	const onStartClick = () => {
		if (!isFinished) {
			return
		}

		void stratUpdating().then(() => {
			dispatch(resetPuzzleDataAction())
		})
	}

	const boardState: BoardState = isFinished
		? { isFinished, isUpdating }
		: { isFinished, isUpdating: false }

	return (
		<PuzzlePageStyled>
			<LevelName {...boardState}>
				{getLevelNameText(puzzleData.levelNumber)}
			</LevelName>
			<RestartButton
				aria-label={restartButtonLabel}
				onClick={onRestartClick}
				disabled={isFinished}
				{...boardState}
			/>
			<WinHeader ref={winHeaderRef} tabIndex={-1} {...boardState}>
				{winHeaderText}
			</WinHeader>
			<PuzzleWrapper>
				<Puzzle
					key={boardVersion}
					imageInfo={puzzleData.imageInfo}
					tiles={puzzleData.level.tiles}
					columns={puzzleData.level.columns}
					rows={puzzleData.level.rows}
					boardState={boardState}
				/>
			</PuzzleWrapper>
			<PlayButton
				{...boardState}
				disabled={boardState.isUpdating}
				onClick={onStartClick}
			>
				{playButtonText}
			</PlayButton>
		</PuzzlePageStyled>
	)
}

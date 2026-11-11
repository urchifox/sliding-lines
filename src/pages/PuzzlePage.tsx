import replayIcon from "../assets/images/replay.svg"

import styled from "@emotion/styled"
import { useEffect, useLayoutEffect, useRef, useState } from "react"

import { theme } from "../assets/styles/theme"
import { Puzzle } from "../puzzle/components/Puzzle"
import { createPuzzleData } from "../puzzle/domain/puzzleData"
import { reshuffleTiles } from "../puzzle/domain/tiles"
import type {
	BoardState,
	PuzzleData,
	PuzzleTileInfo,
	PuzzleTilesArray,
} from "../puzzle/domain/types"
import { handleTryMove } from "../puzzle/flow/handleTryMove"
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
	const [puzzleData, setPuzzleData] = useState<PuzzleData | null>(null)
	const [boardVersion, setBoardVersion] = useState(0)
	const [boardState, setBoardState] = useState<BoardState>({
		isFinished: false,
		isUpdating: false,
	})
	const [isError, setError] = useState<boolean>(false)
	const winHeaderRef = useRef<HTMLHeadingElement>(null)

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

	useLayoutEffect(() => {
		if (!boardState.isFinished) {
			return
		}

		winHeaderRef.current?.focus()
	}, [boardState.isFinished])

	if (puzzleData === null) {
		return (
			<PageStyled>
				<LoadingText color={theme.color.secondary}>
					{isError ? errorText : loadingText}
				</LoadingText>
			</PageStyled>
		)
	}

	const updateTiles = (tiles: PuzzleTilesArray) => {
		setPuzzleData({
			...puzzleData,
			level: {
				...puzzleData.level,
				tiles: tiles,
			},
		})
	}

	const onSolved = () => {
		setBoardState({
			isFinished: true,
			isUpdating: false,
		})
	}

	const onTryMove = (tile: PuzzleTileInfo) => {
		if (boardState.isFinished) {
			return
		}

		updateTiles(
			handleTryMove({
				tile: tile,
				tiles: puzzleData.level.tiles,
				onSolved: onSolved,
			})
		)
	}

	const onRestartClick = () => {
		if (boardState.isFinished) {
			return
		}

		updateTiles(
			reshuffleTiles({
				tiles: puzzleData.level.tiles,
				shuffleSteps: puzzleData.level.shuffleSteps,
			})
		)

		setBoardVersion((version) => version + 1)
	}

	const onStartClick = () => {
		if (!boardState.isFinished) {
			return
		}

		setBoardState({
			isFinished: true,
			isUpdating: true,
		})

		setTimeout(() => {
			setPuzzleData(null)
			setBoardState({
				isFinished: false,
				isUpdating: false,
			})
		}, 1 * 1000)
	}

	return (
		<PuzzlePageStyled>
			<LevelName {...boardState}>
				{getLevelNameText(puzzleData.levelNumber)}
			</LevelName>
			<RestartButton
				aria-label={restartButtonLabel}
				onClick={onRestartClick}
				disabled={boardState.isFinished}
				{...boardState}
			/>
			<WinHeader ref={winHeaderRef} tabIndex={-1} {...boardState}>
				{winHeaderText}
			</WinHeader>
			<PuzzleWrapper>
				<Puzzle
					key={boardVersion}
					imageInfo={puzzleData.imageInfo}
					handleTryMove={onTryMove}
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

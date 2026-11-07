import styled from "@emotion/styled"

import { theme } from "../../assets/styles/theme"
import type { PuzzleTileInfo } from "../domain/types"
import { getTileButtonText, getTileLabel } from "./helpers"

const PuzzleTileStyled = styled.li<{
	isEmpty?: boolean
	row: number
	col: number
	spRow: number
	spCol: number
	isFinished: boolean
}>(
	({ row, col, spRow, spCol, isEmpty, isFinished }) => `
	--row: ${row};
	--col: ${col};

	--offsetY: calc(100% * (var(--row) - 1));
	--offsetX: calc(100% * (var(--col) - 1));

	--ss-gap: 0px;
	--ss-columns: var(--columns);
	--ss-rows: var(--rows);
	--sp-width: calc(var(--ss-width) / var(--ss-columns));
	--sp-height: calc(var(--ss-height) / var(--ss-rows));

	position: absolute;
	top: 0;
	left: 0;
	grid-row: 1 / 2;
	grid-column: 1 / 2;

	border-radius: inherit;
	border: 1px solid ${isEmpty || isFinished ? "transparent" : theme.color.secondary};
	width: calc(100% / var(--columns));
	height: calc(100% / var(--rows));

	list-style: none;

	background-repeat: no-repeat;
	background-size: calc(var(--ss-width) / var(--sp-width) * 100%)
		calc(var(--ss-height) / var(--sp-height) * 100%);
	background-position-x: calc(
		(${spCol} - 1) / max(1, (var(--ss-columns) - 1)) * 100%
	);
	background-position-y: calc(
		(${spRow} - 1) / max(1, (var(--ss-rows) - 1)) * 100%
	);
	background-image: var(--image);

	opacity: ${isEmpty ? "0" : "1"};
	transform: translate(var(--offsetX), var(--offsetY));
	transition:
		transform 0.3s ease,
		border-color var(--reveal-duration) var(--reveal-delay) ease;

	&:has(:focus-visible) {
		z-index: 1;
	}
`
)

const PuzzleTileButtonStyled = styled.button(
	() => `
	width: 100%;
	height: 100%;
	border: none;
	padding: 0;
	background: none;
	cursor: pointer;
	font-size: 0;
	color: transparent;

	&:disabled {
		cursor: auto;
	}
`
)

export function PuzzleTile({
	tile,
	handleClick,
	puzzleRef,
	isFinished,
}: {
	tile: PuzzleTileInfo
	handleClick: () => void
	puzzleRef: React.RefObject<Record<string, HTMLElement | null>>
	isFinished: boolean
}) {
	const { key, currentPosition, originalPosition, isEmpty } = tile

	return (
		<PuzzleTileStyled
			key={key}
			ref={(el) => {
				puzzleRef.current[key] = el
			}}
			row={currentPosition.row}
			col={currentPosition.column}
			spRow={originalPosition.row}
			spCol={originalPosition.column}
			isEmpty={isEmpty}
			isFinished={isFinished}
			aria-label={getTileLabel(key)}
		>
			<PuzzleTileButtonStyled
				type="button"
				onClick={handleClick}
				disabled={isFinished || isEmpty}
			>
				{getTileButtonText(currentPosition)}
			</PuzzleTileButtonStyled>
		</PuzzleTileStyled>
	)
}

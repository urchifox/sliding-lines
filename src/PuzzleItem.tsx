import styled from "@emotion/styled"

import type { Position, PuzzleItemInfo } from "./game"

export function getKey({ row, column }: Position) {
	return `${row}-${column}`
}

const PuzzleItemStyled = styled.li<{
	isEmpty?: boolean
	isReady?: boolean
	row: number
	col: number
	spRow: number
	spCol: number
}>(({isEmpty, row, col, spRow, spCol}) => `
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
	border: 2px solid ${isEmpty ? "transparent" : "black"};
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
	background-image: ${isEmpty ? "transparent" : "var(--image)"};

	transform: translate(var(--offsetX), var(--offsetY));
	transition:
		transform 0.3s ease,
		border-color 0.3s ease,
		background-color 0.3s ease;

	.ready & {
		border-radius: 0;
		border-color: transparent;
		pointer-events: none;
        background-image: var(--image);
	}
`)

export function PuzzleItem({
	item,
	index,
    handleClick,
    refs
}: {
	item: PuzzleItemInfo
	index: number
    handleClick: () => void
    refs: React.RefObject<Record<string, HTMLLIElement | null>>
}) {
	const { current, original, isEmpty } = item

	const key = getKey(original)

	return (
		<PuzzleItemStyled
			isEmpty={isEmpty}
			ref={(el) => {
				refs.current[key] = el
			}}
			key={key}
			onClick={handleClick}
			row={current.row}
			col={current.column}
			spRow={original.row}
			spCol={original.column}
		>
			{`${index + 1} (${key})`}
		</PuzzleItemStyled>
	)
}

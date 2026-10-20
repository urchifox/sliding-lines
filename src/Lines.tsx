import styled from "@emotion/styled"
import { useMemo, useRef } from "react"

import { Line, type LinePropertyManager } from "./Line"
import { getRandomNumber, getUniqueValue } from "./utils"

const LinesContainerStyled = styled.div`
	position: relative;
	width: 100%;
	height: 4em;

	overflow: hidden;
`

function createLineManager<T>(
	occupiedSet: Set<T>,
	getter: () => T
): LinePropertyManager<T> {
	return {
		get: () => getUniqueValue(occupiedSet, getter),
		remove: (value: T) => occupiedSet.delete(value),
	}
}

export function Lines() {
	const occupiedSeconds = useRef(new Set<number>())
	const occupiedTops = useRef(new Set<number>())

	const secondsManager = useMemo(
		() =>
			createLineManager(occupiedSeconds.current, () => getRandomNumber({ min: 0, max: 3, step: 0.1 })),
		[]
	)
	const topManager = useMemo(
		() =>
			createLineManager(
				occupiedTops.current,
				() => 0.5 * getRandomNumber({ min: 0, max: 8 })
			),
		[]
	)

	return (
		<LinesContainerStyled>
			<Line {...{ secondsManager, topManager }} />
			<Line {...{ secondsManager, topManager }} />
			<Line {...{ secondsManager, topManager }} />
		</LinesContainerStyled>
	)
}

import styled from "@emotion/styled"
import { useRef } from "react"

import { Line, type LinePropertyManager } from "./Line"
import { getRandomFloat, getRandomInteger } from "./utils"

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

function getUniqueValue<T>(occupiedSet: Set<T>, getter: () => T): T {
	let newValue = getter()

	while (occupiedSet.has(newValue)) {
		newValue = getter()
	}

	occupiedSet.add(newValue)

	return newValue
}

export function Lines() {
	const occupiedSeconds = useRef(new Set<number>())
	const occupiedTops = useRef(new Set<number>())

	const secondsManager = createLineManager(occupiedSeconds.current, () =>
		getRandomFloat(0, 3)
	)
	const topManager = createLineManager(
		occupiedTops.current,
		() => 0.5 * getRandomInteger(0, 8)
	)

	return (
		<LinesContainerStyled>
			<Line {...{ secondsManager, topManager }} />
			<Line {...{ secondsManager, topManager }} />
			<Line {...{ secondsManager, topManager }} />
		</LinesContainerStyled>
	)
}

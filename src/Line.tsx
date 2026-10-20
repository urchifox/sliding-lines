import styled from "@emotion/styled"
import { useEffect, useState } from "react"

import { theme } from "./assets/styles/theme"
import { getRandomNumber } from "./utils"

export type LinePropertyManager<T> = {
	get: () => T
	remove: (value: T) => boolean
}

const LineStyled = styled.div<{
	top: number
	seconds: number
	animName: string
	direction: string
	width: number
	height: number
}>(
	({ top, seconds, animName, direction, width, height }) => `
    position: absolute;
    top: ${top}em;

    width: ${width}%;
    height: ${height}px;
    background-color: ${theme.color.secondary};

    animation: ${animName} ${seconds}s ease;
    animation-fill-mode: both;
    animation-direction: ${direction};
    
    @keyframes ${animName} {
        from {
            left: -100%;
        }
        to {
            left: 100%;
        }
    }
`
)

export function Line({
	secondsManager,
	topManager,
}: {
	secondsManager: LinePropertyManager<number>
	topManager: LinePropertyManager<number>
}) {
	const [seconds, setSeconds] = useState(() => secondsManager.get())
	const [top, setTop] = useState(() => topManager.get())

	const animName = `slide${seconds.toString().replace(".", "")}`
	const width = getRandomNumber({ min: 30, max: 100 })
	const height = getRandomNumber({ min: 1, max: 5 })
	const direction = getRandomNumber({ min: 0, max: 1 }) === 1 ? "normal" : "reverse"

	useEffect(() => {
		const id = setTimeout(() => {
			secondsManager.remove(seconds)
			topManager.remove(top)
			setSeconds(secondsManager.get())
			setTop(topManager.get())
		}, seconds * 1000)

		return () => {
			clearTimeout(id)
			secondsManager.remove(seconds)
			topManager.remove(top)
		}
	}, [seconds, top, secondsManager, topManager])

	return (
		<LineStyled
			{...{
				seconds,
				top,
				animName,
				direction,
				width,
				height,
			}}
		/>
	)
}

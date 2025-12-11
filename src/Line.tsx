import styled from "@emotion/styled"
import { useState, useEffect } from "react"
import { theme } from "./assets/styles/theme"
import { randomInteger } from "./utils"

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
	const [seconds, setSeconds] = useState<number | null>(null)
	const [top, setTop] = useState<number | null>(null)
	if (seconds === null) {
		setSeconds(secondsManager.get())
	}
	if (top === null) {
		setTop(topManager.get())
	}

	const animName = `slide${seconds?.toString().replace(".", "")}`
	const width = randomInteger(30, 100)
	const height = randomInteger(1, 5)
	const direction = randomInteger(0, 1) === 1 ? "normal" : "reverse"

	useEffect(() => {
		return () => {
			secondsManager.remove(seconds ?? 0)
			topManager.remove(top ?? 0)
		}
	}, [])

	useEffect(() => {
		const id = setTimeout(
			() => {
				secondsManager.remove(seconds ?? 0)
				topManager.remove(top ?? 0)
				setSeconds(secondsManager.get())
				setTop(topManager.get())
			},
			(seconds ?? 0) * 1000
		)

		return () => clearTimeout(id)
	}, [seconds])

	return (
		<LineStyled
			{...{
				seconds: seconds ?? 0,
				top: top ?? 0,
				animName,
				direction,
				width,
				height,
			}}
		/>
	)
}

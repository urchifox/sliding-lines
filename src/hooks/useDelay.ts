import { useEffect, useRef, useState } from "react"

export function useDelay(delayMs = 1000) {
	const [isDelayed, setIsDelayed] = useState(false)
	const timeoutRef = useRef<number | undefined>(undefined)

	useEffect(
		() => () => {
			clearTimeout(timeoutRef.current)
			timeoutRef.current = undefined
		},
		[]
	)

	const startDelay = () => {
		if (timeoutRef.current !== undefined) {
			return
		}

		setIsDelayed(true)
		return new Promise<void>((resolve) => {
			timeoutRef.current = window.setTimeout(() => {
				timeoutRef.current = undefined
				setIsDelayed(false)
				resolve()
			}, delayMs)
		})
	}

	return { isDelayed, startDelay }
}

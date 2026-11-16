import { useEffect, useRef, useState } from "react"

export function useDelay(delayMs = 1000) {
	const [isDelayed, setIsDelayed] = useState(false)
	const timeoutRef = useRef<number | undefined>(undefined)

	useEffect(() => () => clearTimeout(timeoutRef.current), [])

	const startDelay = () => {
		setIsDelayed(true)
		return new Promise((resolve) => {
			timeoutRef.current = window.setTimeout(() => {
				setIsDelayed(false)
				resolve(true)
			}, delayMs)
		})
	}

	return { isDelayed, startDelay }
}

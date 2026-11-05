export const loadingText = "Loading…"

export const errorText = "An error occurred, try to reload the page"

export const restartButtonLabel = "Restart"

export const playButtonText = "Solve next puzzle"

export const winHeaderText = "You have won!"

export function getLevelNameText(levelNumber: number) {
	// Progress stores how many levels are finished, starting at 0.
	return `Level ${levelNumber + 1}`
}

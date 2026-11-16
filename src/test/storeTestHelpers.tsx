import { render } from "@testing-library/react"
import { type ReactElement, StrictMode } from "react"
import { Provider } from "react-redux"

import { store } from "../store"

export function renderWithStore({
	ui,
	isStrictMode,
}: {
	ui: ReactElement
	isStrictMode?: boolean
}) {
	const content = <Provider store={store}>{ui}</Provider>

	return render(isStrictMode ? <StrictMode>{content}</StrictMode> : content)
}

export function rerenderWithStore({
	ui,
	isStrictMode,
	renderResult,
}: {
	ui: ReactElement
	isStrictMode?: boolean
	renderResult: ReturnType<typeof render>
}) {
	const content = <Provider store={store}>{ui}</Provider>

	return renderResult.rerender(
		isStrictMode ? <StrictMode>{content}</StrictMode> : content
	)
}

import "@testing-library/jest-dom/vitest"
import { cleanup } from "@testing-library/react"

import { resetUserInfo } from "../progress/user"

afterEach(() => {
	if (typeof document === "undefined") {
		return
	}

	cleanup()
	resetUserInfo()
	localStorage.clear()
})

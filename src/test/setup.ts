import "@testing-library/jest-dom/vitest"
import { cleanup } from "@testing-library/react"

import { resetUserInfo } from "../progress/user"

afterEach(() => {
	cleanup()
	resetUserInfo()
	localStorage.clear()
})

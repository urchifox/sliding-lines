import * as matchers from "@testing-library/jest-dom/matchers"
import "@testing-library/jest-dom/vitest"
import { cleanup } from "@testing-library/react"

import { resetUserInfo } from "../progress/user"

expect.extend(matchers)

afterEach(() => {
	if (typeof document === "undefined") {
		return
	}

	cleanup()
	resetUserInfo()
	localStorage.clear()
})

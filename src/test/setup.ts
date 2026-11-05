import { createSerializer } from "@emotion/jest"
import "@testing-library/jest-dom/vitest"
import { cleanup } from "@testing-library/react"

import { resetUserInfo } from "../progress/user"

expect.addSnapshotSerializer(createSerializer({ includeStyles: false }))

afterEach(() => {
	if (typeof document === "undefined") {
		return
	}

	cleanup()
	resetUserInfo()
	localStorage.clear()
})

import * as matchers from "@testing-library/jest-dom/matchers"
import { createSerializer } from "@emotion/jest"
import "@testing-library/jest-dom/vitest"
import { cleanup } from "@testing-library/react"

import { resetUserInfo } from "../progress/user"

expect.extend(matchers)

expect.addSnapshotSerializer(createSerializer({ includeStyles: false }))

afterEach(() => {
	if (typeof document === "undefined") {
		return
	}

	cleanup()
	resetUserInfo()
	localStorage.clear()
})

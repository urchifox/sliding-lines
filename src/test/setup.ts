import * as matchers from "@testing-library/jest-dom/matchers"
import { createSerializer } from "@emotion/jest"
import "@testing-library/jest-dom/vitest"
import { cleanup } from "@testing-library/react"

expect.extend(matchers)

expect.addSnapshotSerializer(createSerializer({ includeStyles: false }))

afterEach(async () => {
	if (typeof document === "undefined") {
		return
	}

	const { resetStore } = await import("../store")
	resetStore()

	cleanup()
	localStorage.clear()
})

import { getImageInfo } from "./images"

const loadedSize = { width: 400, height: 200, ratio: 2 }

function stubImageLoad(result: "load" | "error") {
	vi.stubGlobal(
		"Image",
		class {
			naturalWidth = loadedSize.width
			naturalHeight = loadedSize.height
			onload: (() => void) | null = null
			onerror: (() => void) | null = null

			set src(_url: string) {
				if (result === "load") {
					this.onload?.()
				} else {
					this.onerror?.()
				}
			}
		}
	)
}

afterEach(() => {
	vi.unstubAllGlobals()
})

describe("getImageInfo", () => {
	it.each([
		{ levelNumber: 0, expectedImageName: "puzzle-img-1.jpg" },
		{ levelNumber: 2, expectedImageName: "puzzle-img-3.jpg" },
		{ levelNumber: 5, expectedImageName: "puzzle-img-1.jpg" },
	])(
		"uses $expectedImageName for level $levelNumber",
		async ({ levelNumber, expectedImageName }) => {
			stubImageLoad("load")

			const imageInfo = await getImageInfo(levelNumber)

			expect(imageInfo.imageUrl).toContain(expectedImageName)
			expect(imageInfo.width).toBe(loadedSize.width)
			expect(imageInfo.height).toBe(loadedSize.height)
			expect(imageInfo.ratio).toBe(loadedSize.ratio)
		}
	)

	it("falls back to a square when the image fails to load", async () => {
		stubImageLoad("error")

		const imageInfo = await getImageInfo(0)

		expect(imageInfo.width).toBe(1)
		expect(imageInfo.height).toBe(1)
		expect(imageInfo.ratio).toBe(1)
		expect(imageInfo.imageUrl).toContain("puzzle-img-1.jpg")
	})
})

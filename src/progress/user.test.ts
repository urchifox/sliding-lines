// @vitest-environment happy-dom
import {
	getLevelNumber,
	initUserInfo,
	resetUserInfo,
	saveUserInfo,
	upgradeLevel,
} from "./user"

describe("user", () => {
	describe("initUserInfo", () => {
		it("initializes the user info with initial values if no saved info", () => {
			initUserInfo()

			expect(getLevelNumber()).toEqual(0)
			expect(localStorage.getItem("user")).toBe(
				JSON.stringify({ levelNumber: 0 })
			)
		})

		it("initializes the user info with saved values if saved info is valid", () => {
			localStorage.setItem("user", JSON.stringify({ levelNumber: 10 }))

			initUserInfo()

			expect(getLevelNumber()).toEqual(10)
		})

		it("ignores extra keys in saved info", () => {
			localStorage.setItem(
				"user",
				JSON.stringify({ levelNumber: 10, extraKeys: "extraValues" })
			)

			initUserInfo()

			expect(getLevelNumber()).toEqual(10)
			expect(localStorage.getItem("user")).toBe(
				JSON.stringify({ levelNumber: 10 })
			)
		})

		it.each([
			{ savedInfo: null },
			{ savedInfo: "" },
			{ savedInfo: 0 },
			{ savedInfo: [1, 2, 3] },
			{ savedInfo: {} },
			{ savedInfo: { levelNumber: "10" } },
			{ savedInfo: { levelNumber: -1 } },
			{ savedInfo: { levelNumber: 1.5 } },
			{ savedInfo: { levelNumber: null } },
		])(
			"initializes the user info with initial values if saved info is invalid",
			({ savedInfo }) => {
				localStorage.setItem("user", JSON.stringify(savedInfo))

				initUserInfo()

				expect(getLevelNumber()).toEqual(0)
				expect(localStorage.getItem("user")).toBe(
					JSON.stringify({ levelNumber: 0 })
				)
			}
		)

		it("ignores and doesnt throw when saved info is invalid", () => {
			localStorage.setItem("user", "{not json}")

			initUserInfo()

			expect(getLevelNumber()).toBe(0)
			expect(localStorage.getItem("user")).toBe(
				JSON.stringify({ levelNumber: 0 })
			)
		})
	})

	it("resets the user info to initial values", () => {
		localStorage.setItem("user", JSON.stringify({ levelNumber: 10 }))
		initUserInfo()
		resetUserInfo()

		expect(getLevelNumber()).toEqual(0)
		expect(localStorage.getItem("user")).toBe(
			JSON.stringify({ levelNumber: 0 })
		)
	})

	it("upgrades the level number", () => {
		initUserInfo()

		upgradeLevel()

		expect(getLevelNumber()).toEqual(1)
		expect(localStorage.getItem("user")).toBe(
			JSON.stringify({ levelNumber: 1 })
		)
	})

	it("persists the current user info", () => {
		initUserInfo()
		upgradeLevel()
		localStorage.clear()

		saveUserInfo()

		expect(localStorage.getItem("user")).toBe(
			JSON.stringify({ levelNumber: 1 })
		)
	})
})

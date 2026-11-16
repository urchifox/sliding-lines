// @vitest-environment happy-dom
import { act, renderHook } from "@testing-library/react"

import { useDelay } from "./useDelay"

function renderDelay(delayMs?: number) {
	return renderHook(() => useDelay(delayMs))
}

async function advanceTime(milliseconds: number) {
	await act(() => vi.advanceTimersByTimeAsync(milliseconds))
}

describe("useDelay", () => {
	beforeEach(() => {
		vi.useFakeTimers()
	})

	afterEach(() => {
		vi.useRealTimers()
	})

	it("is not delayed initially", () => {
		const { result } = renderDelay()

		expect(result.current.isDelayed).toBe(false)
	})

	it("is delayed until the default delay ends", async () => {
		const { result } = renderDelay()
		const onEnd = vi.fn()

		act(() => {
			void result.current.startDelay()?.then(onEnd)
		})

		expect(result.current.isDelayed).toBe(true)

		await advanceTime(999)

		expect(result.current.isDelayed).toBe(true)
		expect(onEnd).not.toHaveBeenCalled()

		await advanceTime(1)

		expect(result.current.isDelayed).toBe(false)
		expect(onEnd).toHaveBeenCalledOnce()
	})

	it("uses the given delay", async () => {
		const { result } = renderDelay(300)
		const onEnd = vi.fn()

		act(() => {
			void result.current.startDelay()?.then(onEnd)
		})
		await advanceTime(300)

		expect(result.current.isDelayed).toBe(false)
		expect(onEnd).toHaveBeenCalledOnce()
	})

	it("ignores start while delayed", async () => {
		const { result } = renderDelay()
		const onFirstEnd = vi.fn()

		act(() => {
			void result.current.startDelay()?.then(onFirstEnd)
		})
		await advanceTime(500)

		let secondDelay: Promise<void> | undefined
		act(() => {
			secondDelay = result.current.startDelay()
		})

		expect(secondDelay).toBeUndefined()

		await advanceTime(500)

		expect(result.current.isDelayed).toBe(false)
		expect(onFirstEnd).toHaveBeenCalledOnce()
	})

	it("ignores repeated start before rerender", async () => {
		const { result } = renderDelay()
		const onEnd = vi.fn()

		act(() => {
			void result.current.startDelay()?.then(onEnd)
			void result.current.startDelay()?.then(onEnd)
		})
		await advanceTime(1000)

		expect(onEnd).toHaveBeenCalledOnce()
	})

	it("can be started again after the delay ends", async () => {
		const { result } = renderDelay()
		const onEnd = vi.fn()

		act(() => {
			void result.current.startDelay()?.then(onEnd)
		})
		await advanceTime(1000)
		act(() => {
			void result.current.startDelay()?.then(onEnd)
		})

		expect(result.current.isDelayed).toBe(true)

		await advanceTime(1000)

		expect(onEnd).toHaveBeenCalledTimes(2)
	})

	it("does not resolve after unmount", async () => {
		const { result, unmount } = renderDelay()
		const onEnd = vi.fn()

		act(() => {
			void result.current.startDelay()?.then(onEnd)
		})
		unmount()
		await advanceTime(1000)

		expect(onEnd).not.toHaveBeenCalled()
		expect(vi.getTimerCount()).toBe(0)
	})
})

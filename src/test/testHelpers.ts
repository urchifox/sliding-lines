import type { TileKey } from "../puzzle/domain/types"

export type Deferred<T> = {
	promise: Promise<T>
	resolve: (value: T) => T
	reject: () => void
}

export function createDeferred<T>(): Deferred<T> {
	let resolve: Deferred<T>["resolve"] = () => undefined as T
	let reject: Deferred<T>["reject"] = () => undefined
	const promise = new Promise<T>((res, rej) => {
		resolve = (value: T) => {
			res(value)
			return value
		}
		reject = rej
	})
	return { promise, resolve, reject }
}
export const tileLabelPrefix = "Tile "

export function getTileLabel(key: TileKey): string {
	return `${tileLabelPrefix}${key}`
}

export const tileLabelMatcher = new RegExp(`${tileLabelPrefix}\\d-\\d`)

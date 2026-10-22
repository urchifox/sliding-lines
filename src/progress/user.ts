type UserInfo = {
	levelNumber: number
}

const LOCAL_STORAGE_USER_INFO_KEY = "user"

const initialUserInfo: Readonly<UserInfo> = {
	levelNumber: 0,
}
const userInfo: UserInfo = { ...initialUserInfo }

export function initUserInfo() {
	try {
		const savedInfo = localStorage.getItem(LOCAL_STORAGE_USER_INFO_KEY)
		if (savedInfo === null) {
			resetUserInfo()
			return
		}

		const parsed = JSON.parse(savedInfo)
		if (isUserInfoValid(parsed)) {
			applyUserInfo(parsed)
		} else {
			resetUserInfo()
		}
	} catch {
		resetUserInfo()
	}
}

function applyUserInfo(info: UserInfo) {
	const entries = Object.entries(info) as Array<
		[keyof UserInfo, UserInfo[keyof UserInfo]]
	>
	for (const [key, sourceValue] of entries) {
		if (key in initialUserInfo) {
			userInfo[key] = sourceValue
		}
	}
	saveUserInfo()
}

export function resetUserInfo() {
	applyUserInfo(initialUserInfo)
}

export function saveUserInfo() {
	const isValid = isUserInfoValid(userInfo)
	if (!isValid) {
		throw new Error("User info is not valid")
	}
	localStorage.setItem(LOCAL_STORAGE_USER_INFO_KEY, JSON.stringify(userInfo))
}

function isUserInfoValid(info: unknown): info is UserInfo {
	if (typeof info !== "object" || info === null || !("levelNumber" in info)) {
		return false
	}

	const { levelNumber } = info
	const isLevelNumberValid =
		typeof levelNumber === "number" &&
		Number.isInteger(levelNumber) &&
		levelNumber >= 0
	return isLevelNumberValid
}

export function getLevelNumber() {
	return userInfo.levelNumber
}

export function upgradeLevel() {
	userInfo.levelNumber++
	saveUserInfo()
}

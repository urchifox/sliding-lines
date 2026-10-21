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
			return
		}

		const parsed = JSON.parse(savedInfo)
		if (isUserInfoValid(parsed)) {
			applyUserInfo(parsed)
		}
	} catch {
		// ignore corrupt storage
	}
}

function applyUserInfo(info: UserInfo) {
	const entries = Object.entries(info) as Array<
		[keyof UserInfo, UserInfo[keyof UserInfo]]
	>
	for (const [key, sourceValue] of entries) {
		userInfo[key] = sourceValue
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

	const { levelNumber } = userInfo
	const isLevelNumberValid = Number.isInteger(levelNumber) && levelNumber >= 0
	return isLevelNumberValid
}

export function getLevelNumber() {
	return userInfo.levelNumber
}

export function upgradeLevel() {
	userInfo.levelNumber++
	saveUserInfo()
}

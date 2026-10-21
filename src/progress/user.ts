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
		applyUserInfo(JSON.parse(savedInfo) as UserInfo)
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
	const isValid = isUserInfoValid()
	if (!isValid) {
		throw new Error("User info is not valid")
	}
	localStorage.setItem(LOCAL_STORAGE_USER_INFO_KEY, JSON.stringify(userInfo))
}

export function isUserInfoValid() {
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

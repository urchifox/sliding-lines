type UserInfo = {
	levelNumber: number
}

const LOCAL_STORAGE_USER_INFO_KEY = "user"

const initialUserInfo: UserInfo = {
	levelNumber: 0,
}
const userInfo: UserInfo = initialUserInfo

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
	localStorage.setItem(LOCAL_STORAGE_USER_INFO_KEY, JSON.stringify(userInfo))
}

export function getLevelNumber() {
	return userInfo.levelNumber
}

export function upgradeLevel() {
	userInfo.levelNumber++
	saveUserInfo()
}

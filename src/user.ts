type UserInfo = {
	levelNumber: number
}

const LOCAL_STORAGE_USER_INFO_KEY = "user"

const userInfo: UserInfo = {
	levelNumber: 0,
}

export function initUserInfo() {
	try {
		const savedInfo = localStorage.getItem(LOCAL_STORAGE_USER_INFO_KEY)
		if (savedInfo !== null) {
			applyUserInfo(JSON.parse(savedInfo) as UserInfo)
			return
		}
	} catch {
		// ignore corrupt storage
	}
	saveUserInfo()
}

function applyUserInfo(info: UserInfo) {
	const entries = Object.entries(info) as Array<
		[keyof UserInfo, UserInfo[keyof UserInfo]]
	>
	for (const [key, sourceValue] of entries) {
		userInfo[key] = sourceValue
	}
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

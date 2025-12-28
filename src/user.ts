type UserInfo = {
	levelNumber: number
}

const LOCAL_STORAGE_USER_INFO_KEY = "user"

export const userInfo: UserInfo = {
	levelNumber: 0,
}

export function initUserInfo() {
	const savedInfo = localStorage.getItem(LOCAL_STORAGE_USER_INFO_KEY)
	if (savedInfo !== null) {
		applyUserInfo(JSON.parse(savedInfo))
	} else {
		saveUserInfo()
	}
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

export const USER_PATTERNS = {
	CREATE_USER: 'create_user',
	FIND_USERS: 'find_users',
	FIND_USER_BY_ID: 'find_user_by_id',
} as const;

export const USER_EVENTS = {
	USER_CREATED: 'user.created',
} as const;

export type UserPattern = (typeof USER_PATTERNS)[keyof typeof USER_PATTERNS];
export type UserEvent = (typeof USER_EVENTS)[keyof typeof USER_EVENTS];

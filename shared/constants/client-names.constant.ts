export const CLIENT_NAMES = {
	USER_SERVICE: 'USER_SERVICE',
	NOTIFICATION_SERVICE: 'NOTIFICATION_SERVICE',
} as const;

export type ClientName = (typeof CLIENT_NAMES)[keyof typeof CLIENT_NAMES];

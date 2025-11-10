export const QUEUES = {
	USER_QUEUE: 'user_queue',
	NOTIFICATION_QUEUE: 'notification_queue',
	DELAYED_NOTIFICATION_QUEUE: 'delayed_notification_queue',
} as const;

export const QUEUE_NAMES = {
	USERS: 'users',
	NOTIFICATIONS: 'notifications',
	DELAYED_NOTIFICATIONS: 'delayed_notifications',
} as const;

export const DLX_EXCHANGE = 'dlx' as const;

export type QueueName = (typeof QUEUE_NAMES)[keyof typeof QUEUE_NAMES];

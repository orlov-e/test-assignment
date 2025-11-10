export const QUEUES = {
	USER_QUEUE: 'user_queue',
	NOTIFICATION_QUEUE: 'notification_queue',
	DEFERRED_QUEUE: 'deferred_queue',
} as const;

export const DEAD_LETTER_EXCHANGE = 'dead_letter_exchange' as const;

export type QueueName = (typeof QUEUES)[keyof typeof QUEUES];

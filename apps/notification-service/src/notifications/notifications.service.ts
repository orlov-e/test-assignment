import { Injectable, OnModuleInit } from '@nestjs/common';
import * as amqp from 'amqp-connection-manager';
import { ChannelWrapper } from 'amqp-connection-manager';

@Injectable()
export class NotificationsService implements OnModuleInit {
	private connection: amqp.AmqpConnectionManager;
	private channelWrapper: ChannelWrapper;
	private readonly DELAY_MS = 24 * 60 * 60 * 1000;

	async onModuleInit() {
		await this.setupDelayedQueue();
	}

	private async setupDelayedQueue() {
		const rabbitmqUrl = process.env.RABBITMQ_URL || 'amqp://admin:admin123@localhost:5672';

		this.connection = amqp.connect([rabbitmqUrl]);

		this.channelWrapper = this.connection.createChannel({
			setup: async (channel: any) => {
				await channel.assertQueue('notification_queue', { durable: true });

				await channel.assertQueue('delayed_notification_queue', {
					durable: true,
					deadLetterExchange: '',
					deadLetterRoutingKey: 'notification_queue',
					messageTtl: this.DELAY_MS,
				});

				console.log('Delayed notification queue configured with 24h TTL');
			},
		});

		await this.channelWrapper.waitForConnect();
	}

	async scheduleWelcomeNotification(userData: any) {
		const message = {
			userId: userData.id,
			username: userData.username,
			type: 'welcome',
			scheduledAt: new Date(),
			deliverAt: new Date(Date.now() + this.DELAY_MS),
		};

		await this.channelWrapper.sendToQueue('delayed_notification_queue', Buffer.from(JSON.stringify(message)), {
			persistent: true,
		});

		console.log(`Scheduled welcome notification for user ${userData.username} to be sent in 24 hours`);
	}

	async onModuleDestroy() {
		await this.channelWrapper.close();
		await this.connection.close();
	}
}

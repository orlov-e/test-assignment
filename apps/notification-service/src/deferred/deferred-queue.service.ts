import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as amqp from 'amqp-connection-manager';
import { Channel } from 'amqplib';
import { QUEUES, DEAD_LETTER_EXCHANGE } from '@shared/constants';

@Injectable()
export class DeferredQueueService implements OnModuleInit {
	private readonly logger = new Logger(DeferredQueueService.name);

	constructor(private readonly configService: ConfigService) {}

	async onModuleInit(): Promise<void> {
		const rabbitmqUrl = this.configService.get<string>('RABBITMQ_URL')!;
		const delayMs = this.configService.get<number>('NOTIFICATION_DELAY_MS') || 86400000;
		const connection = amqp.connect([rabbitmqUrl]);
		const channel = connection.createChannel({
			setup: async (ch: Channel) => {
				await ch.assertQueue(QUEUES.NOTIFICATION_QUEUE, { durable: true });
				await ch.assertExchange(DEAD_LETTER_EXCHANGE, 'direct', { durable: true });
				await ch.bindQueue(QUEUES.NOTIFICATION_QUEUE, DEAD_LETTER_EXCHANGE, QUEUES.NOTIFICATION_QUEUE);
				await ch.assertQueue(QUEUES.DEFERRED_QUEUE, {
					durable: true,
					messageTtl: delayMs,
					deadLetterExchange: DEAD_LETTER_EXCHANGE,
					deadLetterRoutingKey: QUEUES.NOTIFICATION_QUEUE,
				});
				this.logger.log(`Deferred queue configured with ${delayMs}ms TTL`);
			},
		});
		await channel.waitForConnect();
		await channel.close();
		await connection.close();
	}
}

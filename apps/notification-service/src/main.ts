import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { QUEUES } from '@shared/constants';

async function bootstrap() {
	const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
		transport: Transport.RMQ,
		options: {
			urls: [process.env.RABBITMQ_URL || 'amqp://admin:admin123@localhost:5672'],
			queue: QUEUES.NOTIFICATION_QUEUE,
			queueOptions: {
				durable: true,
			},
		},
	});

	await app.listen();
	console.log('Notification Service is listening on notification_queue');
}

bootstrap();

import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';
import { RpcExceptionFilter } from '@shared/helpers';

async function bootstrap() {
	const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
		transport: Transport.RMQ,
		options: {
			urls: [process.env.RABBITMQ_URL || 'amqp://admin:admin123@localhost:5672'],
			queue: 'user_queue',
			queueOptions: {
				durable: true,
			},
			noAck: false,
			prefetchCount: 1,
		},
		bufferLogs: true,
	});

	app.useLogger(app.get(Logger));
	app.useGlobalFilters(new RpcExceptionFilter());

	await app.listen();
	console.log('User Service is listening for RabbitMQ messages');
}

bootstrap();

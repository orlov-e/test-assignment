import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CLIENT_NAMES, QUEUES } from '@shared/constants';

@Module({
	imports: [
		ClientsModule.register([
			{
				name: CLIENT_NAMES.NOTIFICATION_SERVICE,
				transport: Transport.RMQ,
				options: {
					urls: [process.env.RABBITMQ_URL || 'amqp://admin:admin123@localhost:5672'],
					queue: QUEUES.NOTIFICATION_QUEUE,
					queueOptions: {
						durable: true,
					},
				},
			},
		]),
	],
	controllers: [UsersController],
	providers: [UsersService],
})
export class UsersModule {}

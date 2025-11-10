import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CLIENT_NAMES, QUEUES } from '@shared/constants';

@Module({
	imports: [
		ClientsModule.registerAsync([
			{
				name: CLIENT_NAMES.NOTIFICATION_SERVICE,
				inject: [ConfigService],
				useFactory: (config: ConfigService) => ({
					transport: Transport.RMQ,
					options: {
						urls: [config.get<string>('RABBITMQ_URL') || 'amqp://admin:admin123@localhost:5672'],
						queue: QUEUES.DEFERRED_QUEUE,
						queueOptions: {
							durable: true,
						},
						noAssert: true,
					},
				}),
			},
		]),
	],
	controllers: [UsersController],
	providers: [UsersService],
})
export class UsersModule {}

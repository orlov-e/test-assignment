import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CLIENT_NAMES, QUEUES } from '@shared/constants';

@Module({
	imports: [
		ClientsModule.registerAsync([
			{
				name: CLIENT_NAMES.USER_SERVICE,
				inject: [ConfigService],
				useFactory: (config: ConfigService) => ({
					transport: Transport.RMQ,
					options: {
						urls: [config.get<string>('RABBITMQ_URL') || 'amqp://admin:admin123@localhost:5672'],
						queue: QUEUES.USER_QUEUE,
						queueOptions: {
							durable: true,
						},
					},
				}),
			},
		]),
	],
	controllers: [UserController],
	providers: [UserService],
})
export class UserModule {}

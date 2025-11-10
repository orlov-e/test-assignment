import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { NotificationsModule } from './notifications/notifications.module';
import { DeferredQueueModule } from './deferred/deferred-queue.module';
import { environmentValidationSchema } from '@shared/env/environment.validation';
import { loggerConfig } from '@shared/config';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			validationSchema: environmentValidationSchema,
			validationOptions: {
				abortEarly: true,
			},
		}),
		LoggerModule.forRoot(loggerConfig),
		DeferredQueueModule,
		NotificationsModule,
	],
})
export class AppModule {}

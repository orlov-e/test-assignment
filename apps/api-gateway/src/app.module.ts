import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { HealthModule } from './health/health.module';
import { UserModule } from './user/user.module';
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
		HealthModule,
		UserModule,
	],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './infrastructure/prisma/prisma.module';
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
		PrismaModule,
		UsersModule,
	],
})
export class AppModule {}

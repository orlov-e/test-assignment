import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';

async function bootstrap() {
	const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter(), {
		abortOnError: false,
		bufferLogs: true,
	});

	app.useLogger(app.get(Logger));
	app.enableCors();

	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			forbidNonWhitelisted: true,
			transform: true,
			transformOptions: {
				enableImplicitConversion: true,
			},
		}),
	);

	app.setGlobalPrefix('api');
	app.enableVersioning({
		type: VersioningType.URI,
		defaultVersion: '1',
	});

	const config = app.get(ConfigService);

	const swaggerConfig = new DocumentBuilder()
		.setTitle('OBRIO API')
		.setDescription('User Management with Scheduled Notifications')
		.setVersion('1.0')
		.build();
	const document = SwaggerModule.createDocument(app, swaggerConfig);
	SwaggerModule.setup('docs', app, document);

	const port = config.get('PORT') || 3000;
	await app.listen(port, '0.0.0.0');
	console.log(`🚀 API Gateway running on http://localhost:${port}`);
	console.log(`📚 Swagger docs at http://localhost:${port}/docs`);
}

bootstrap();

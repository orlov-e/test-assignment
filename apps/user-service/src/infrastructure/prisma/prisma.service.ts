import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { NestApplication } from '@nestjs/core';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
	private readonly logger = new Logger(PrismaService.name);

	constructor() {
		super({
			log: [
				{ level: 'query', emit: 'event' },
				{ level: 'error', emit: 'stdout' },
				{ level: 'warn', emit: 'stdout' },
			],
		});
	}

	async onModuleInit() {
		await this.$connect();
		this.logger.log('Database connected successfully');
	}

	async onModuleDestroy() {
		await this.$disconnect();
		this.logger.log('Database disconnected');
	}

	async enableShutdownHooks(app: NestApplication) {
		process.on('beforeExit', async () => {
			await app.close();
		});
	}
}

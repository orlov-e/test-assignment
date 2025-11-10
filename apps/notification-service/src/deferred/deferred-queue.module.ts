import { Module } from '@nestjs/common';
import { DeferredQueueService } from './deferred-queue.service';

@Module({
	providers: [DeferredQueueService],
	exports: [DeferredQueueService],
})
export class DeferredQueueModule {}

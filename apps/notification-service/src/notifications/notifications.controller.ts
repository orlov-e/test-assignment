import { Controller } from '@nestjs/common';
import { EventPattern, Payload, Ctx, RmqContext } from '@nestjs/microservices';
import { NotificationsService } from './notifications.service';
import { USER_EVENTS } from '@shared/constants';

@Controller()
export class NotificationsController {
	constructor(private readonly notificationsService: NotificationsService) {}

	@EventPattern(USER_EVENTS.USER_CREATED)
	async handleUserCreated(@Payload() data: any, @Ctx() context: RmqContext) {
		const channel = context.getChannelRef();
		const originalMsg = context.getMessage();

		try {
			await this.notificationsService.scheduleWelcomeNotification(data);
			channel.ack(originalMsg);
		} catch (error) {
			console.error('Failed to schedule notification:', error);
			channel.nack(originalMsg, false, true);
		}
	}
}

import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { NotificationsService } from './notifications.service';
import { NOTIFICATION_EVENTS } from '@shared/constants';
import { NotificationEventDto } from '@shared/dto';

@Controller()
export class NotificationsController {
	private readonly logger = new Logger(NotificationsController.name);

	constructor(private readonly notificationsService: NotificationsService) {}

	@EventPattern(NOTIFICATION_EVENTS.SEND_NOTIFICATION)
	async handleSendNotification(@Payload() data: NotificationEventDto): Promise<void> {
		try {
			this.logger.log(`Processing notification for user: ${data.username}`);
			const notification = {
				userId: data.id,
				username: data.username,
				type: 'welcome',
				message: `Welcome to OBRIO, ${data.username}!`,
			};
			await this.notificationsService.sendNotification(notification);
		} catch (error) {
			this.logger.error('Failed to send notification:', error);
			throw error;
		}
	}
}

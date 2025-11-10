import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface NotificationMessage {
	userId: string;
	username: string;
	type: string;
	message: string;
}

@Injectable()
export class NotificationsService {
	private readonly logger = new Logger(NotificationsService.name);

	constructor(private readonly configService: ConfigService) {}

	async sendNotification(notification: NotificationMessage): Promise<void> {
		const externalApiUrl = this.configService.get<string>('EXTERNAL_API_URL')!;

		try {
			this.logger.log(`Sending notification to external API: ${externalApiUrl}`);

			const response = await fetch(externalApiUrl, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(notification),
			});

			if (!response.ok) {
				throw new Error(`External API returned status ${response.status}`);
			}

			this.logger.log(`Successfully sent ${notification.type} notification for user ${notification.username}`);
		} catch (error) {
			this.logger.error(`Failed to send notification to external API:`, error);
			throw error;
		}
	}
}

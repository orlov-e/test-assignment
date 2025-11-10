import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { PrismaService } from '../infrastructure/prisma/prisma.service';
import { CreateUserDto, UserResponseDto } from '@shared/dto';
import { ClientProxy } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';
import { CLIENT_NAMES, NOTIFICATION_EVENTS } from '@shared/constants';

@Injectable()
export class UsersService {
	constructor(
		private readonly prisma: PrismaService,
		@Inject(CLIENT_NAMES.NOTIFICATION_SERVICE) private readonly notificationClient: ClientProxy,
	) {}

	async createUser(createUserDto: CreateUserDto): Promise<UserResponseDto> {
		try {
			const existingUser = await this.prisma.user.findUnique({
				where: { username: createUserDto.username },
			});

			if (existingUser) {
				throw new RpcException({
					statusCode: 409,
					message: 'User with this username already exists',
				});
			}

			const user = await this.prisma.user.create({
				data: {
					username: createUserDto.username,
				},
			});

			this.notificationClient.emit(NOTIFICATION_EVENTS.SEND_NOTIFICATION, {
				id: user.id,
				username: user.username,
				createdAt: user.createdAt,
			});

			return {
				id: user.id,
				username: user.username,
				createdAt: user.createdAt,
				updatedAt: user.updatedAt,
			};
		} catch (error) {
			if (error instanceof RpcException) {
				throw error;
			}
			throw new RpcException({
				statusCode: 500,
				message: 'Failed to create user',
				error: error.message,
			});
		}
	}
}

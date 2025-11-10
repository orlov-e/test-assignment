import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { PrismaService } from '../infrastructure/prisma/prisma.service';
import {
	CreateUserDto,
	PaginationQueryDto,
	UserResponseDto,
	PaginatedResponseDto,
	PaginationMetaDto,
} from '@shared/dto';
import { ClientProxy } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';
import { USER_EVENTS, CLIENT_NAMES } from '@shared/constants';

@Injectable()
export class UsersService {
	constructor(
		private readonly prisma: PrismaService,
		@Inject(CLIENT_NAMES.NOTIFICATION_SERVICE) private readonly notificationClient: ClientProxy
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

			this.notificationClient.emit(USER_EVENTS.USER_CREATED, {
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

	async findUsers(paginationQuery: PaginationQueryDto): Promise<PaginatedResponseDto<UserResponseDto>> {
		try {
			const { page = 1, limit = 10 } = paginationQuery;
			const skip = (page - 1) * limit;

			const [users, total] = await Promise.all([
				this.prisma.user.findMany({
					skip,
					take: limit,
					orderBy: { createdAt: 'desc' },
				}),
				this.prisma.user.count(),
			]);

			const items: UserResponseDto[] = users.map((user: any) => ({
				id: user.id,
				username: user.username,
				createdAt: user.createdAt,
				updatedAt: user.updatedAt,
			}));

			return {
				data: items,
				meta: new PaginationMetaDto(page, limit, total),
			};
		} catch (error) {
			throw new RpcException({
				statusCode: 500,
				message: 'Failed to fetch users',
				error: error.message,
			});
		}
	}

	async findUserById(id: string): Promise<UserResponseDto> {
		try {
			const user = await this.prisma.user.findUnique({
				where: { id },
			});

			if (!user) {
				throw new RpcException({
					statusCode: 404,
					message: 'User not found',
				});
			}

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
				message: 'Failed to fetch user',
				error: error.message,
			});
		}
	}
}

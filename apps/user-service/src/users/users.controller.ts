import { Controller } from '@nestjs/common';
import { MessagePattern, Payload, Ctx, RmqContext, EventPattern } from '@nestjs/microservices';
import { UsersService } from './users.service';
import { CreateUserDto, PaginationQueryDto } from '@shared/dto';
import { USER_PATTERNS } from '@shared/constants';

@Controller()
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@MessagePattern(USER_PATTERNS.CREATE_USER)
	async createUser(@Payload() createUserDto: CreateUserDto, @Ctx() context: RmqContext) {
		const channel = context.getChannelRef();
		const originalMsg = context.getMessage();

		try {
			const user = await this.usersService.createUser(createUserDto);
			channel.ack(originalMsg);
			return user;
		} catch (error) {
			channel.nack(originalMsg, false, false);
			throw error;
		}
	}

	@MessagePattern(USER_PATTERNS.FIND_USERS)
	async findUsers(@Payload() paginationQuery: PaginationQueryDto, @Ctx() context: RmqContext) {
		const channel = context.getChannelRef();
		const originalMsg = context.getMessage();

		try {
			const result = await this.usersService.findUsers(paginationQuery);
			channel.ack(originalMsg);
			return result;
		} catch (error) {
			channel.nack(originalMsg, false, false);
			throw error;
		}
	}

	@MessagePattern(USER_PATTERNS.FIND_USER_BY_ID)
	async findUserById(@Payload() data: { id: string }, @Ctx() context: RmqContext) {
		const channel = context.getChannelRef();
		const originalMsg = context.getMessage();

		try {
			const user = await this.usersService.findUserById(data.id);
			channel.ack(originalMsg);
			return user;
		} catch (error) {
			channel.nack(originalMsg, false, false);
			throw error;
		}
	}
}

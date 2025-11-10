import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { CLIENT_NAMES, USER_PATTERNS } from '@shared/constants';
import { CreateUserDto, UserResponseDto } from '@shared/dto';

@Injectable()
export class UserService {
	constructor(
		@Inject(CLIENT_NAMES.USER_SERVICE)
		private readonly userClient: ClientProxy,
	) {}

	async createUser(dto: CreateUserDto): Promise<UserResponseDto> {
		return firstValueFrom(this.userClient.send(USER_PATTERNS.CREATE_USER, dto));
	}
}

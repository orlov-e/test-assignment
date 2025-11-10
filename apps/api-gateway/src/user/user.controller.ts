import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto, PaginationQueryDto, UserResponseDto } from '@shared/dto';

@ApiTags('Users')
@Controller({ path: 'users', version: '1' })
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Post()
	@ApiOperation({ summary: 'Create a new user' })
	@ApiBody({ type: CreateUserDto })
	@ApiResponse({
		status: 201,
		description: 'User created successfully',
		type: UserResponseDto,
	})
	async createUser(@Body() dto: CreateUserDto): Promise<UserResponseDto> {
		return this.userService.createUser(dto);
	}

	@Get()
	@ApiOperation({ summary: 'Get all users with pagination' })
	@ApiResponse({
		status: 200,
		description: 'List of users',
	})
	async findAll(@Query() query: PaginationQueryDto) {
		return this.userService.findAll(query);
	}

	@Get(':id')
	@ApiOperation({ summary: 'Get user by ID' })
	@ApiParam({ name: 'id', description: 'User ID' })
	@ApiResponse({
		status: 200,
		description: 'User found',
		type: UserResponseDto,
	})
	async findOne(@Param('id') id: string): Promise<UserResponseDto> {
		return this.userService.findOne(id);
	}
}

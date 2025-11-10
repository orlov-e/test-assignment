import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
	@ApiProperty({
		description: 'User ID',
		example: 'ca3968db-72e6-4afb-9c01-9a6c223dd9cd',
	})
	id: string;

	@ApiProperty({
		description: 'Username',
		example: 'john_doe',
	})
	username: string;

	@ApiProperty({
		description: 'Creation timestamp',
		example: '2025-11-10T09:59:57.617Z',
	})
	createdAt: Date;

	@ApiProperty({
		description: 'Last update timestamp',
		example: '2025-11-10T09:59:57.617Z',
	})
	updatedAt: Date;

	constructor(partial: Partial<UserResponseDto>) {
		Object.assign(this, partial);
	}
}

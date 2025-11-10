import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
	@ApiProperty({
		description: 'Username for the user',
		example: 'eugene orlov',
		minLength: 3,
		maxLength: 50,
	})
	@IsString()
	@IsNotEmpty()
	@MinLength(3)
	@MaxLength(50)
	username: string;
}

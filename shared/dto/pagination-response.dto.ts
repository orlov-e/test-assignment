import { ApiProperty } from '@nestjs/swagger';

export class PaginationMetaDto {
	@ApiProperty({ description: 'Current page number' })
	page: number;

	@ApiProperty({ description: 'Items per page' })
	limit: number;

	@ApiProperty({ description: 'Total number of items' })
	total: number;

	@ApiProperty({ description: 'Total number of pages' })
	totalPages: number;

	@ApiProperty({ description: 'Indicates if there is a previous page' })
	hasPreviousPage: boolean;

	@ApiProperty({ description: 'Indicates if there is a next page' })
	hasNextPage: boolean;

	constructor(page: number, limit: number, total: number) {
		this.page = page;
		this.limit = limit;
		this.total = total;
		this.totalPages = Math.ceil(total / limit);
		this.hasPreviousPage = page > 1;
		this.hasNextPage = page < this.totalPages;
	}
}

export class PaginatedResponseDto<T> {
	@ApiProperty({ description: 'Array of data items' })
	data: T[];

	@ApiProperty({ description: 'Pagination metadata', type: PaginationMetaDto })
	meta: PaginationMetaDto;

	constructor(data: T[], meta: PaginationMetaDto) {
		this.data = data;
		this.meta = meta;
	}
}

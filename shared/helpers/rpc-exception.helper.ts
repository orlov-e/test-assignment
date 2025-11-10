import { RpcException } from '@nestjs/microservices';
import { Catch, ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';

export interface RpcExceptionData {
	code: number;
	message: string;
}

export function CustomRpcException(data: RpcExceptionData): RpcException {
	return new RpcException({
		statusCode: data.code,
		message: data.message,
	});
}

@Catch(RpcException)
export class RpcExceptionFilter implements ExceptionFilter {
	catch(exception: RpcException, host: ArgumentsHost): Observable<any> {
		return throwError(() => exception.getError());
	}
}

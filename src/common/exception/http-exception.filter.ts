import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
    Injectable,
} from '@nestjs/common';
import { isString } from 'class-validator';
import { FastifyReply } from 'fastify';

@Catch()
@Injectable()
export class HttpExceptionFilter implements ExceptionFilter {
    constructor() {}

    catch(exception: Error, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<FastifyReply>();

        const status: number =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        const responseData: string = this.getMessage(exception);
        response.status(status).send({ error: true, message: responseData });
    }

    private getMessage(exception: Error): string {
        const status: number =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        if (exception instanceof HttpException) {
            const response: string | object = exception.getResponse();
            if (isString(response)) {
                return response;
            } else if ('message' in response) {
                if (isString(response.message)) {
                    return response.message;
                } else if (
                    Array.isArray(response.message) &&
                    response.message.every(item => isString(item))
                ) {
                    return response.message.join(' , ');
                }
            }
        }

        if ('message' in exception && isString(exception.message)) {
            return exception.message;
        } else {
            return HttpStatus[status].replace('_', ' ');
        }
    }
}

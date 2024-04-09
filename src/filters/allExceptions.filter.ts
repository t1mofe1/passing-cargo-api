import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { FastifyReply, FastifyRequest } from 'fastify';
import { uppercaseFirstLetter } from '../utils/stringHelpers';

@Catch()
export class AllExceptionsFilter<
  TError extends Error | HttpException | WsException = Error,
> implements ExceptionFilter<TError>
{
  catch(exception: TError, host: ArgumentsHost) {
    if (host.getType() === 'http') {
      const ctx = host.switchToHttp();
      const req = ctx.getRequest<FastifyRequest>();
      const res = ctx.getResponse<FastifyReply>();

      let defaultResponse: Record<string, unknown> = {};
      let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      let message = HttpStatus[statusCode]
        .split('_')
        .map((word) => uppercaseFirstLetter(word))
        .join(' ');

      if (exception instanceof HttpException) {
        statusCode = exception.getStatus();

        const exceptionResponse = exception.getResponse();
        defaultResponse =
          typeof exceptionResponse === 'string'
            ? { error: exceptionResponse }
            : (exceptionResponse as Record<string, unknown>);
        message = exception.message;
      } else if (exception instanceof Error) {
        defaultResponse = {
          error: exception.message,
          stack: exception.stack?.split('\n'),
        };
      }

      res.status(statusCode).send({
        message,
        statusCode,
        timestamp: new Date().toISOString(),
        path: req.url,
        ...defaultResponse,
      });
    } else {
      // const ctx = host.switchToWs();
      // const client = ctx.getClient<Socket>();
      // const ctxData = ctx.getData();
      // const data = {
      //   message: exception.message,
      //   ...ctxData,
      // };
      // client.emit('error', data);
    }
  }
}

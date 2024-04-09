import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { map } from 'rxjs/operators';
import EnhancedJSON from '../utils/EnhancedJSON';

@Injectable()
export class JsonSerializerInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    const res = context.switchToHttp().getResponse<FastifyReply>();

    res.header('Content-Type', 'application/json');

    return next.handle().pipe(map((data) => EnhancedJSON.stringify(data)));
  }
}

import { Injectable, NestMiddleware } from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import { Logger } from '../logger/logger';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(req: FastifyRequest['raw'], res: FastifyReply['raw'], next: () => void) {
    res.on('finish', () => {
      const { method, url } = req;
      const { statusCode, statusMessage } = res;

      const message = `${method} (${statusCode} ${statusMessage}) - ${url}`;

      if (statusCode >= 500) {
        return this.logger.error(message);
      }

      if (statusCode >= 400) {
        return this.logger.warn(message);
      }

      return this.logger.log(message);
    });

    next();
  }
}

import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const JwtToken = createParamDecorator(
  (data: never, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    const token = request.headers.authorization?.split(' ')[1];

    return token;
  },
);

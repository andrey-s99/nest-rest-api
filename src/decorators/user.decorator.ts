import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// Custom decorator to extract username and id from the Request object after it is added by a Guard
export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);

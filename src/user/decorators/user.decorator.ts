import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from 'src/user/schemas/user.model';

type TypeData = keyof User;

export const UserDec = createParamDecorator(
  (data: TypeData, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    return data ? user?.[data] : user;
  }
);

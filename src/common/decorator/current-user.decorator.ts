import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';

export interface ICurrentUser {
  userId: string;
  email: string;
  role: 'ADMIN' | 'CUSTOMER';
}

export const CurrentUser = createParamDecorator(
  (data: keyof ICurrentUser | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as ICurrentUser;


    if (!user) {
      throw new UnauthorizedException('Bạn cần đăng nhập để thực hiện hành động này!');
    }

    return data ? user[data] : user; 
  },
);
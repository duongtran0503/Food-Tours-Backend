import { IS_PUBLIC_KEY } from '@/common/decorator/is.public';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    // 1. Kiểm tra xem API (hoặc Controller) có chứa @Public() hay không
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(), // kiểm tra ở cấp hàm hàm/endpoint
      context.getClass(),   // kiểm tra ở cấp Class/Controller
    ]);

    if (isPublic) {
      return true; // Nếu có @Public(), cho qua luôn không cần token!
    }

    // 2. Nếu không có @Public(), chạy logic xác thực JWT mặc định của Passport
    return super.canActivate(context);
  }
}
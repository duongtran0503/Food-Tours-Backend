import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    
    if (!requiredRoles) {
      return true; 
    }
    
    const { user } = context.switchToHttp().getRequest();
    
    // THÊM 3 DÒNG NÀY ĐỂ BẮT LỖI
    console.log('--- KIỂM TRA QUYỀN TRUY CẬP ---');
    console.log('1. API này cho phép các quyền:', requiredRoles);
    console.log('2. Thông tin User đang đăng nhập:', user);

    return requiredRoles.includes(user?.role);
  }
}
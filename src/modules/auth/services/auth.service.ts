import { AppException } from "@/common/exceptions/app.exception";
import { AppConfig } from "@/config/app.config";
import { AuthErrorCode } from "@/modules/auth/config/auth.error.code";
import { LoginRequest } from "@/modules/auth/dto/request/login-request";
import { RegisterUserRequest } from "@/modules/auth/dto/request/register-user-request";
import { UserRepository } from "@/modules/users/repositories/user.repository";
import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from 'bcrypt';
import { Types } from "mongoose";
@Injectable()
export class AuthService {
 constructor(private readonly userRepository:UserRepository,
    private readonly jwtService:JwtService
 ){
 }

 async register(data:RegisterUserRequest) {
    const existingUser = await this.userRepository.findOne({ email: data.email });
    if (existingUser) {
      throw new AppException(AuthErrorCode.EMAIL_EXISTED);
    }

    const hashedPassword = await bcrypt.hash(data.password, AppConfig.SECURITY.SALT_ROUNDS);

    const newUser = await this.userRepository.create({
      ...data,
      password: hashedPassword,
      role: AppConfig.ROLES.CUSTOMER,
    });

    const payload = {sub:newUser._id,email:newUser.email,role:newUser.role}
    return this.generateJwtToken(payload)
 }

 async login(data:LoginRequest) {
    const user = await this.userRepository.findOneWithPassword({ email: data.email });
    if (!user) {
      throw new AppException(AuthErrorCode.ACCOUNT_NOT_FOUND);
    }

    // Kiểm tra tài khoản có bị khóa không
    if (!user.isActive) {
      throw new AppException(AuthErrorCode.ACCOUNT_LOCKED);
    }

    // Kiểm tra password
    const isMatch = await bcrypt.compare(data.password, user.password);
    if (!isMatch) {
      throw new AppException(AuthErrorCode.WRONG_PASSWORD);
    }

    const payload = { sub: user._id, email: user.email, role: user.role };
    
    return {
      userInfo: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        avatar:user.avatar
      },
      tokens:this.generateJwtToken(payload)
    };
  }

 private generateJwtToken(payload:{sub:Types.ObjectId;email:string;role:string}) {
    return {
        accessToken: this.jwtService.sign(payload),
        refreshToken: this.jwtService.sign(payload, { expiresIn: '7d' }),
    };
 }
}
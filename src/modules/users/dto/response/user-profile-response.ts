import { ApiProperty } from '@nestjs/swagger';
import { User, UserRoles, UserStatus } from "@/schemas/user.schema";
import { HydratedDocument } from 'mongoose';

export class UserProfileResponse {
  @ApiProperty({ example: '65fc34e45d4f3b0012abcd12', description: 'ID duy nhất của người dùng' })
  id: string;

  @ApiProperty({ example: 'duong@example.com' })
  email: string;

  @ApiProperty({ example: 'Dương Nguyễn' })
  fullName: string;

  @ApiProperty({ example: '0901234567', description: 'Số điện thoại liên lạc' })
  phoneNumber: string; // Bổ sung trường này

  @ApiProperty({ 
    example: UserRoles.CUSTOMER, 
    enum: UserRoles, 
    description: 'Vai trò: ADMIN, CUSTOMER, hoặc MERCHANT' 
  })
  role: string;

  @ApiProperty({ 
    example: UserStatus.ACTIVE, 
    enum: UserStatus, 
    description: 'Trạng thái tài khoản' 
  })
  status: string;

  @ApiProperty({ example: 'https://cdn.com/avatar.png' })
  avatar: string;

  @ApiProperty({ example: '2026-03-27T12:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2026-03-27T12:30:00.000Z' })
  updatedAt: Date;

  constructor(user: HydratedDocument<User>) { 
    this.id = user._id?.toString() || (user as any).id;
    this.email = user.email;
    this.fullName = user.fullName;
    this.phoneNumber = user.phoneNumber || '';
    this.role = user.role;
    this.status = user.status;
    this.avatar = user.avatar || 'https://www.gravatar.com/avatar/?d=mp';
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }
}
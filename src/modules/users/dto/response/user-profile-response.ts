import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EntityDocument } from "@/common/repositories/base-repository";
import { User } from "@/schemas/user.schema";

export class UserProfileResponse {
  @ApiProperty({ example: '65fc34e45d4f3b0012abcd12' })
  id: string;

  @ApiProperty({ example: 'staff_thanh@example.com' })
  email: string;

  @ApiProperty({ example: 'Lê Văn Thanh' })
  fullName: string;

  @ApiProperty({ example: 'STAFF', enum: ['ADMIN', 'STAFF', 'CUSTOMER'] })
  role: string;

  @ApiProperty({ example: 'ACTIVE', enum: ['ACTIVE', 'LOCKED'] })
  status: string;

  @ApiPropertyOptional({ example: '0987654321' })
  phoneNumber?: string;

  @ApiProperty({ example: 'https://cdn.com/avatar.png' })
  avatar: string;

  @ApiProperty({ example: '2026-03-27T12:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2026-03-27T12:30:00.000Z' })
  updatedAt: Date;

  constructor(user: EntityDocument<User>) { 
    this.id = user.id || user._id?.toString();
    this.email = user.email;
    this.fullName = user.fullName;
    this.role = user.role;
    this.status = user.status;
    this.avatar = user.avatar || '';
    this.phoneNumber = user.phoneNumber || '';
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }
}
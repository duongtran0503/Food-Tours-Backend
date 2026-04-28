import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum, IsUrl } from 'class-validator';
import { UserStatus } from '@/schemas/user.schema';

export class UpdateStaffRequest {
  @ApiPropertyOptional({ example: 'Lê Văn Thanh (Updated)' })
  @IsOptional()
  @IsString()
  fullName?: string;

  @ApiPropertyOptional({ example: 'https://cdn.com/avatar/staff1.png' })
  @IsOptional()
  @IsUrl({}, { message: 'Đường dẫn ảnh đại diện không hợp lệ' })
  avatar?: string;

  @ApiPropertyOptional({ example: '0987654321' })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiPropertyOptional({ enum: UserStatus, example: 'LOCKED' })
  @IsOptional()
  @IsEnum(UserStatus, { message: 'Trạng thái tài khoản không hợp lệ' })
  status?: UserStatus;
}
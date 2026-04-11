import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum, IsUrl, IsEmail, Matches } from 'class-validator';
import { UserStatus, UserRoles } from '@/schemas/user.schema';

export class UpdateStaffRequest {
  @ApiPropertyOptional({ example: 'Lê Văn Thanh (Updated)' })
  @IsOptional()
  @IsString()
  fullName?: string;

  @ApiPropertyOptional({ example: 'staff@example.com' })
  @IsOptional()
  @IsEmail({}, { message: 'Email không đúng định dạng' })
  email?: string; 

  @ApiPropertyOptional({ example: '0988777666' })
  @IsOptional()
  @IsString()
  
  @Matches(/^[0-9]{10}$/, { message: 'Số điện thoại phải đủ 10 chữ số' })
  phoneNumber?: string; 

  @ApiPropertyOptional({ enum: UserRoles, example: UserRoles.MERCHANT })
  @IsOptional()
  @IsEnum(UserRoles, { message: 'Vai trò người dùng không hợp lệ' })
  role?: UserRoles; 

  @ApiPropertyOptional({ example: 'https://cdn.com/avatar/staff1.png' })
  @IsOptional()
  @IsUrl({}, { message: 'Đường dẫn ảnh đại diện không hợp lệ' })
  avatar?: string;

  @ApiPropertyOptional({ enum: UserStatus, example: UserStatus.LOCKED })
  @IsOptional()
  @IsEnum(UserStatus, { message: 'Trạng thái tài khoản không hợp lệ' })
  status?: UserStatus;
}
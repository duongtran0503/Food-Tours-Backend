import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength, IsOptional, IsEnum } from 'class-validator';
import { UserRoles } from '@/schemas/user.schema';

export class CreateStaffRequest {
  @ApiProperty({ example: 'staff_thanh@example.com', description: 'Email của nhân viên' })
  @IsEmail({}, { message: 'Email không đúng định dạng' })
  @IsNotEmpty({ message: 'Email không được để trống' })
  email: string;

  @ApiProperty({ example: 'Lê Văn Thanh', description: 'Họ và tên nhân viên' })
  @IsString()
  @IsNotEmpty({ message: 'Họ và tên không được để trống' })
  fullName: string;

  @ApiPropertyOptional({ example: '0987654321' })
  @IsOptional()
  @IsString()

  phoneNumber?: string;

  @ApiProperty({ example: 'password123', description: 'Mật khẩu khởi tạo tối thiểu 8 ký tự' })
  @IsString()
  @MinLength(2, { message: 'Mật khẩu phải chứa tối thiểu 2 ký tự' }) 
  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  password: string;

  @ApiPropertyOptional({ enum: [UserRoles.ADMIN, UserRoles.STAFF], description: 'Vai trò tài khoản' })
  @IsOptional()
  @IsEnum(UserRoles, { message: 'Vai trò không hợp lệ' })
  role?: string;
}
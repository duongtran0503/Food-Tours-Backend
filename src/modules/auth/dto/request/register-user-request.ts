import { Match } from '@/common/decorator/match.decorator';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterUserRequest {
  @ApiProperty({ 
    example: 'duong@example.com', 
    description: 'Email đăng ký' 
  })
  @IsEmail({}, { message: 'Email không đúng định dạng' })
  @IsNotEmpty({ message: 'Email không được để trống' })
  email: string;

  @ApiProperty({ 
    example: '123456', 
    description: 'Mật khẩu (ít nhất 2 ký tự)' 
  })
  @IsString()
  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  @MinLength(2, { message: 'Mật khẩu phải có ít nhất 2 ký tự' })
  password: string;

  @ApiProperty({ 
    example: '123456', 
    description: 'Xác nhận lại mật khẩu' 
  })
  @IsString()
  @IsNotEmpty({ message: 'Xác nhận mật khẩu không được để trống' })
  @Match('password', { message: 'Mật khẩu xác nhận không trùng khớp' }) 
  confirmPassword: string;

  @ApiProperty({ 
    example: 'Dương Nguyễn', 
    description: 'Họ và tên đầy đủ' 
  })
  @IsString()
  @IsNotEmpty({ message: 'Họ tên không được để trống' })
  fullName: string;
}
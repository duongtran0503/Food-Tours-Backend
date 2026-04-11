import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength, IsEnum, Matches } from 'class-validator';
import { UserRoles } from '@/schemas/user.schema';

export class CreateStaffRequest {
  @ApiProperty({ 
    example: 'staff_thanh@example.com', 
    description: 'Email định danh của nhân viên' 
  })
  @IsEmail({}, { message: 'Email không đúng định dạng' })
  @IsNotEmpty({ message: 'Email không được để trống' })
  email: string;

  @ApiProperty({ 
    example: 'Lê Văn Thanh', 
    description: 'Họ và tên đầy đủ của nhân viên' 
  })
  @IsString()
  @IsNotEmpty({ message: 'Họ và tên không được để trống' })
  fullName: string;

  @ApiProperty({ 
    example: '0988777666', 
    description: 'Số điện thoại liên lạc của nhân viên' 
  })
  @IsString()
  @IsNotEmpty({ message: 'Số điện thoại không được để trống' })
  @Matches(/^[0-9]{10}$/, { message: 'Số điện thoại phải đủ 10 chữ số' })
  phoneNumber: string;

  @ApiProperty({ 
    example: 'AdminPass123!', 
    description: 'Mật khẩu khởi tạo (nên có cả chữ và số)' 
  })
  @IsString()
  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  @MinLength(8, { message: 'Mật khẩu nhân viên phải có ít nhất 8 ký tự để đảm bảo bảo mật' }) 
  password: string;

  @ApiProperty({ 
    example: UserRoles.ADMIN, 
    enum: UserRoles,
    description: 'Vai trò của nhân viên (thường mặc định là ADMIN)' 
  })
  @IsEnum(UserRoles, { message: 'Vai trò nhân viên không hợp lệ' })
  @IsNotEmpty()
  role: UserRoles = UserRoles.ADMIN;
}
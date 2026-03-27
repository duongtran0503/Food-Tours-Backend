import { ApiProperty } from '@nestjs/swagger';

export class UserInfoResponse {
  @ApiProperty({ example: '65fc34e45d4f3b0012abcd12', description: 'ID người dùng' })
  id: string;

  @ApiProperty({ example: 'duong@example.com', description: 'Email người dùng' })
  email: string;

  @ApiProperty({ example: 'Dương Nguyễn', description: 'Họ và tên' })
  fullName: string;

  @ApiProperty({ example: 'USER', enum: ['USER', 'ADMIN'], description: 'Vai trò trong hệ thống' })
  role: string;

  @ApiProperty({ example: 'https://example.com/avatar.png', description: 'Link ảnh đại diện' })
  avatar: string;

  constructor(user: any) {
    this.id = user._id?.toString() || user.id?.toString();
    this.email = user.email;
    this.fullName = user.fullName;
    this.role = user.role;
    this.avatar = user.avatar || '';
  }
}

export class TokenResponse {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsIn...', description: 'JWT Access Token' })
  accessToken: string;

  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsIn...', description: 'JWT Refresh Token' })
  refreshToken?: string;
}

export class AuthResponse {
  @ApiProperty({ type: UserInfoResponse })
  userInfo: UserInfoResponse;

  @ApiProperty({ type: TokenResponse })
  tokens: TokenResponse;

  constructor(user: any, tokens: TokenResponse) {
    this.userInfo = new UserInfoResponse(user);
    this.tokens = tokens;
  }
}
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsPhoneNumber } from 'class-validator';

export class UpdateUserProfileRequest {
    @ApiPropertyOptional({ example: 'Lê Văn Thanh' })
    @IsOptional()
    @IsString()
    fullName?: string;

    @ApiPropertyOptional({ example: '0987654321' })
    @IsOptional()
    @IsString()
    @IsPhoneNumber('VN')
    phoneNumber?: string;

    @ApiPropertyOptional({ example: 'https://cdn.com/avatar.png' })
    @IsOptional()
    @IsString()
    avatar?: string;
}
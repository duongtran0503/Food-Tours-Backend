import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { UserStatus } from '@/schemas/user.schema';

export class GetStaffsQueryRequest {
  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Type(() => Number) 
  page?: number = 1;

  @ApiPropertyOptional({ example: 10 })
  @IsOptional()
  @Type(() => Number)
  limit?: number = 10;

  @ApiPropertyOptional({ example: 'Thanh', description: 'Tìm kiếm theo tên hoặc email' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ enum: UserStatus, example: 'ACTIVE', description: 'Lọc theo trạng thái' })
  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;
}
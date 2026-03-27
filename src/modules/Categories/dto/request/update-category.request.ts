import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsBoolean, IsUrl } from 'class-validator';

export class UpdateCategoryRequest {
  @ApiPropertyOptional({ example: 'Món nước đặc sản', description: 'Tên danh mục cần sửa' })
  @IsOptional()
  @IsString()
  name?: string; 

  @ApiPropertyOptional({ example: 'mon-nuoc-dac-san', description: 'Slug cần sửa' })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiPropertyOptional({ example: 'https://cdn.com/icons/new-icon.png', description: 'Icon mới' })
  @IsOptional()
  @IsUrl({}, { message: 'Đường dẫn icon không hợp lệ' })
  icon?: string;

  @ApiPropertyOptional({ example: false, description: 'Ẩn/Hiện danh mục' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
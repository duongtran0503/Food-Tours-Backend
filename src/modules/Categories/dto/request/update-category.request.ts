import { MultiLanguage } from '@/schemas/MultiLanguage';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsString, IsBoolean, IsUrl, IsObject, ValidateNested } from 'class-validator';

export class UpdateCategoryRequest {
  @ApiPropertyOptional({
    example: { vi: 'Món nước đặc sản' },
    description: 'Tên danh mục cần sửa'
  })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => MultiLanguage)
  name?: MultiLanguage;

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
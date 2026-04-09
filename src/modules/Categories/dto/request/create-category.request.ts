import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsUrl, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { MultiLanguage } from '@/schemas/MultiLanguage';
export class CreateCategoryRequest {
  @ApiProperty({
    example: { vi: 'Đặc sản Hội An', en: 'Hoi An Specialties' },
    description: 'Tên danh mục món ăn (Đa ngôn ngữ)'
  })
  @IsObject()
  @ValidateNested()
  @Type(() => MultiLanguage)
  @IsNotEmpty({ message: 'Tên danh mục không được để trống' })
  name: MultiLanguage;

  @ApiProperty({ example: 'dac-san-hoi-an', description: 'Mã slug danh mục (Duy nhất)' })
  @IsString()
  @IsNotEmpty({ message: 'Mã danh mục không được để trống' })
  slug: string;

  @ApiPropertyOptional({ example: 'Các món ăn đặc sản tại Hội An', description: 'Mô tả danh mục' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'https://cdn.com/icons/food.png', description: 'Đường dẫn ảnh Icon' })
  @IsOptional()
  @IsUrl({}, { message: 'Đường dẫn Icon không hợp lệ' })
  icon?: string;
}
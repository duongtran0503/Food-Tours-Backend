import { MultiLanguage } from '@/schemas/MultiLanguage';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsString, IsNumber, IsArray, IsEnum, IsMongoId, Min, ValidateNested, IsObject, IsNotEmpty } from 'class-validator';

export class UpdateFoodRequest {
  @ApiProperty({ example: { vi: 'Bánh Mì Hội An', en: 'Hoi An Banh Mi' } })
  @IsObject()
  @ValidateNested()
  @Type(() => MultiLanguage)
  @IsNotEmpty({ message: 'Tên món ăn không được để trống' })
  name: MultiLanguage;


  @ApiPropertyOptional({
    example: { vi: 'Bánh mì đặc sản với pate và bơ béo ngậy', en: 'Special banh mi with pate and butter' }
  })
  @IsObject()
  @ValidateNested()
  @Type(() => MultiLanguage)
  description?: MultiLanguage;
  @ApiPropertyOptional({ example: 'banh-mi-ga', description: 'Slug mới' })
  @IsOptional()
  slug?: string;

  @ApiPropertyOptional({ example: '65fc34e45d4f3b0012abcd12', description: 'ID danh mục mới' })
  @IsOptional()
  @IsMongoId({ message: 'ID danh mục không hợp lệ' })
  category?: string;

  @ApiPropertyOptional({ example: ['https://cdn.com/foods/banh-mi-new.png'], description: 'Ảnh mới' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @ApiPropertyOptional({ example: 30000 })
  @IsOptional()
  @IsNumber()
  @Min(0, { message: 'Giá thấp nhất không được âm' })
  minPrice?: number;

  @ApiPropertyOptional({ example: 40000 })
  @IsOptional()
  @IsNumber()
  @Min(0, { message: 'Giá cao nhất không được âm' })
  maxPrice?: number;

  @ApiPropertyOptional({ enum: ['AVAILABLE', 'OUT_OF_STOCK'], example: 'OUT_OF_STOCK' })
  @IsOptional()
  @IsEnum(['AVAILABLE', 'OUT_OF_STOCK'])
  status?: string;
}
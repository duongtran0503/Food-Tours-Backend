import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, IsArray, IsEnum, IsMongoId, Min } from 'class-validator';

export class UpdateFoodRequest {
  @ApiPropertyOptional({ example: 'Bánh Mì Gà', description: 'Tên món ăn mới' })
  @IsOptional()
  @IsString()
  name?: string;

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
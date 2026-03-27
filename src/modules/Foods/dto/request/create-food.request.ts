import { FoodStatus } from '@/schemas/foods.chema';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsNumber, IsArray, IsEnum, IsMongoId, Min } from 'class-validator';

export class CreateFoodRequest {
  @ApiProperty({ example: 'Bánh Mì Hội An', description: 'Tên món ăn' })
  @IsString()
  @IsNotEmpty({ message: 'Tên món ăn không được để trống' })
  name: string;

  @ApiProperty({ example: 'banh-mi-hoi-an', description: 'Slug (mã) duy nhất của món ăn' })
  @IsString() 
  @IsNotEmpty({ message: 'Món ăn bắt buộc phải gắn với một mã(slug)' })
  slug: string;

  @ApiProperty({ example: '65fc34e45d4f3b0012abcd12', description: 'ID danh mục món ăn thuộc về' })
  @IsMongoId({ message: 'ID danh mục không hợp lệ' })
  @IsNotEmpty({ message: 'Món ăn bắt buộc phải thuộc một danh mục' })
  category: string;

  @ApiPropertyOptional({ example: ['https://cdn.com/foods/banh-mi.png'], description: 'Mảng URL hình ảnh' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @ApiProperty({ example: 25000, description: 'Giá thấp nhất' })
  @IsNumber()
  @Min(0, { message: 'Giá thấp nhất không được âm' })
  minPrice: number;

  @ApiProperty({ example: 35000, description: 'Giá cao nhất' })
  @IsNumber()
  @Min(0, { message: 'Giá cao nhất không được âm' })
  maxPrice: number;

  @ApiPropertyOptional({ enum: FoodStatus, example: 'AVAILABLE', description: 'Trạng thái món ăn' })
  @IsOptional()
  @IsEnum(FoodStatus)
  status?: string;
}
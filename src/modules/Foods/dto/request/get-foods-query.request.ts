import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsMongoId } from 'class-validator';
import { Type } from 'class-transformer';

export class GetFoodsQueryRequest {
  @ApiPropertyOptional({ example: 1, description: 'Trang hiện tại' })
  @IsOptional()
  @Type(() => Number)
  page?: number = 1;

  @ApiPropertyOptional({ example: 10, description: 'Số lượng phần tử mỗi trang' })
  @IsOptional()
  @Type(() => Number)
  limit?: number = 10;

  @ApiPropertyOptional({ example: 'Bánh mì', description: 'Tìm kiếm theo tên món ăn' })
  @IsOptional()
  @IsString()
  search?: string; 

  @ApiPropertyOptional({ example: '65fc34e45d4f3b0012abcd12', description: 'Lọc theo ID danh mục' })
  @IsOptional()
  @IsMongoId({ message: 'ID danh mục không hợp lệ' })
  categoryId?: string; 
}
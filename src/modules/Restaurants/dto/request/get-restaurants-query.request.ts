import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsMongoId } from 'class-validator';
import { Type } from 'class-transformer';

export class GetRestaurantsQueryRequest {
  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Type(() => Number)
  page?: number = 1;

  @ApiPropertyOptional({ example: 10 })
  @IsOptional()
  @Type(() => Number)
  limit?: number = 10;

  @ApiPropertyOptional({ example: 'Thanh', description: 'Tìm theo tên quán ăn' })
  @IsOptional()
  @IsString()
  search?: string; 

  @ApiPropertyOptional({ example: '65fc34e45d4f3b0012abcd45', description: 'Lọc quán có bán món này' })
  @IsOptional()
  @IsMongoId({ message: 'ID món ăn không hợp lệ' })
  foodId?: string; 
}
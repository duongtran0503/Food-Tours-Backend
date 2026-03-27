import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty } from 'class-validator';

export class ActionCategoryFoodRequest {
  @ApiProperty({ example: '65fc34e45d4f3b0012abcd12', description: 'ID danh mục món ăn' })
  @IsMongoId({ message: 'ID danh mục không hợp lệ' })
  @IsNotEmpty({ message: 'ID danh mục không được để trống' })
  categoryId: string;
}
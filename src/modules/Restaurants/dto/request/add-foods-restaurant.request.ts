import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsMongoId, IsNotEmpty } from 'class-validator';

export class AddFoodsToRestaurantRequest {
  @ApiProperty({ example: ['65fc34e45d4f3b0012abcd45', '65fc34e45d4f3b0012abcd46'], description: 'Mảng các ID món ăn' })
  @IsArray({ message: 'Danh sách món ăn phải là một mảng' })
  @IsNotEmpty({ message: 'Mảng danh sách món ăn không được để trống' })
  @IsMongoId({ each: true, message: 'ID món ăn trong mảng không hợp lệ' })
  foodIds: string[];
}

export class RemoveFoodsFromRestaurantRequest {
  @ApiProperty({ example: ['65fc34e45d4f3b0012abcd45'], description: 'Mảng các ID món ăn cần gỡ bỏ' })
  @IsArray({ message: 'Danh sách món ăn phải là một mảng' })
  @IsNotEmpty({ message: 'Mảng danh sách món ăn không được để trống' })
  @IsMongoId({ each: true, message: 'ID món ăn trong mảng không hợp lệ' })
  foodIds: string[];
}
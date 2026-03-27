import { IsArray, IsMongoId, IsNotEmpty } from 'class-validator';

export class RemoveFoodsFromRestaurantRequest {
  @IsArray({ message: 'Danh sách món ăn phải là một mảng' })
  @IsNotEmpty({ message: 'Mảng danh sách món ăn không được để trống' })
  @IsMongoId({ each: true, message: 'ID món ăn trong mảng không hợp lệ' })
  foodIds: string[];
}
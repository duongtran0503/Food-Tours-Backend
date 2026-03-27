import { ApiProperty } from '@nestjs/swagger';
import { EntityDocument } from "@/common/repositories/base-repository";
import { FoodCategory } from "@/schemas/food-categories.schema";

export class CategoryResponse {
  @ApiProperty({ example: '65fc34e45d4f3b0012abcd12', description: 'ID danh mục' })
  id: string;

  @ApiProperty({ example: 'Đặc sản Hội An', description: 'Tên danh mục' })
  name: string;

  @ApiProperty({ example: 'dac-san-hoi-an', description: 'Slug danh mục' })
  slug: string;

  @ApiProperty({ example: 'https://cdn.com/icons/food.png', description: 'URL Icon' })
  icon: string;

  constructor(data: EntityDocument<FoodCategory>) {
    this.id = data._id?.toString() || data.id;
    this.name = data.categoryName;
    this.slug = data.slug;
    this.icon = data.iconUrl; 
  }
}
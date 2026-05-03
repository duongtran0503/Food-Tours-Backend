import { ApiProperty } from '@nestjs/swagger';
import { EntityDocument } from "@/common/repositories/base-repository";
import { Food } from "@/schemas/foods.chema";

export class PriceRangeResponse {
  @ApiProperty({ example: 25000 })
  min: number;

  @ApiProperty({ example: 35000 })
  max: number;
}

export class FoodResponse {
  @ApiProperty({ example: '65fc34e45d4f3b0012abcd45' })
  id: string;

  @ApiProperty({ example: 'Bánh Mì Hội An' })
  name: string;

  @ApiProperty({ example: { vi: 'Bánh Mì Hội An', en: 'Hoi An Bread', jp: 'バインミー' } })
  nameRaw: any; 

  @ApiProperty({ example: 'Bánh mì đặc sản với pate và bơ' })
  description: string;

  @ApiProperty({ example: { vi: 'Mô tả tiếng Việt', en: 'English description', jp: '日本語の説明' } })
  descriptionRaw: any;

  @ApiProperty({ example: 'banh-mi-hoi-an' })
  slug: string;

  @ApiProperty({ example: '65fc34e45d4f3b0012abcd12' })
  categoryId: string;

  @ApiProperty({ example: ['https://cdn.com/foods/bm.png'] })
  images: string[];

  @ApiProperty({ type: PriceRangeResponse })
  priceRange: PriceRangeResponse;

  @ApiProperty({ example: 'AVAILABLE' })
  status: string;

  constructor(data: any, lang: string = 'vi') {
    this.id = data._id?.toString() || data.id;
    this.name = data.dishName?.[lang] || data.dishName?.vi || '';
    this.description = data.description?.[lang] || data.description?.vi || '';
    this.nameRaw = data.dishName || {};
    this.descriptionRaw = data.description || {};
    this.slug = data.slug;
    this.categoryId = data.category?.toString();
    this.images = data.images || [];
    this.priceRange = {
      min: data.minPrice,
      max: data.maxPrice,
    };
    this.status = data.status;
  }
}
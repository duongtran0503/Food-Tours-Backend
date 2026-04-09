import { ApiProperty } from '@nestjs/swagger';


export class CategoryResponse {
  @ApiProperty({ example: '65fc34e45d4f3b0012abcd12', description: 'ID danh mục' })
  id: string;

  @ApiProperty({ example: 'Đặc sản Hội An', description: 'Tên danh mục (Đã lọc theo ngôn ngữ)' })
  name: string;

  @ApiProperty({ example: 'dac-san-hoi-an', description: 'Slug danh mục' })
  slug: string;

  @ApiProperty({ example: 'https://cdn.com/icons/food.png', description: 'URL Icon' })
  icon: string;

  constructor(data: any, lang: string = 'vi') {
    this.id = data._id?.toString() || data.id;
    this.name = data.categoryName?.[lang] || data.categoryName?.vi || '';
    this.slug = data.slug;
    this.icon = data.iconUrl;
  }
}
import { ApiProperty } from '@nestjs/swagger';
import { EntityDocument } from "@/common/repositories/base-repository";
import { FoodResponse } from "@/modules/Foods/dto/response/food-response.dto";
import { Restaurant } from "@/schemas/restaurant.schema";

export class RestaurantDetailResponse {
  @ApiProperty({ example: '65fc34e45d4f3b0012abcd11' })
  id: string;

  @ApiProperty({ example: 'Quán Cao lầu Thanh' })
  name: string;

  @ApiProperty({ example: '26 Thái Phiên, Minh An, Hội An' })
  address: string;

  @ApiProperty({
    type: 'object',
    properties: { lat: { type: 'number', example: 15.87944 }, lng: { type: 'number', example: 108.33194 } }
  })
  location: { lat: number; lng: number };

  @ApiProperty({ example: '0905123456' })
  phoneNumber: string;

  @ApiProperty({ example: '07:00 - 22:00' })
  openingHours: string;

  @ApiProperty({ example: ['https://cdn.com/res.png'] })
  images: string[];

  @ApiProperty({ type: [FoodResponse], description: 'Danh sách chi tiết món ăn' })
  foods: FoodResponse[]; 

  constructor(data: EntityDocument<Restaurant>) {
    this.id = data._id?.toString() || data.id;
    this.name = data.name;
    this.address = data.address;
    this.location = data.location;
    this.phoneNumber = data.phoneNumber || '';
    this.openingHours = data.openingHours || '';
    this.images = data.images || [];
    
    this.foods = data.foods && data.foods.length > 0 && typeof data.foods[0] === 'object'
      ? data.foods.map((food: any) => new FoodResponse(food))
      : [];
  }
}
import { ApiProperty } from '@nestjs/swagger';
import { EntityDocument } from "@/common/repositories/base-repository";
import { Restaurant } from "@/schemas/restaurant.schema";

class LocationResponse {
  @ApiProperty({ example: 15.87944 })
  lat: number;

  @ApiProperty({ example: 108.33194 })
  lng: number;
}

export class RestaurantResponse {
  @ApiProperty({ example: '65fc34e45d4f3b0012abcd11' })
  id: string;

  @ApiProperty({ example: 'Quán Cao lầu Thanh' })
  name: string;
  @ApiProperty({ example: 'Quán Cao lầu Thanh' })
  description: string;

  @ApiProperty({ example: '26 Thái Phiên, Minh An, Hội An' })
  address: string;

  reviews: number;
  rating: number;

  @ApiProperty({ type: LocationResponse })
  location: LocationResponse;

  @ApiProperty({ example: '0905123456' })
  phoneNumber: string;

  @ApiProperty({ example: '07:00 - 22:00' })
  openingTime: string;

  @ApiProperty({ example: ['https://cdn.com/res.png'] })
  images: string[];

  @ApiProperty({ example: ['65fc34e45d4f3b0012abcd45'] })
  foods: string[];

  constructor(data: any, lang: string = 'vi') {
    this.id = data._id?.toString() || data.id;
    this.name = data.name?.[lang] || '';
    this.address = data.address?.[lang] || '';
    this.location = data.location;
    this.description = data.description?.[lang] || '';
    this.phoneNumber = data.phoneNumber || '';
    this.rating = 5
    this.reviews = 100
    this.openingTime = data.openingHours?.[lang] || '';
    this.images = data.images || [];
    this.foods = data.foods ? data.foods.map((food: string) => food.toString()) : [];
  }
}
import { ApiProperty } from '@nestjs/swagger';
import { EntityDocument } from "@/common/repositories/base-repository";
import { Restaurant } from "@/schemas/restaurant.schema";

class LocationResponse {
  @ApiProperty({ example: 15.87944 })
  lat: number;

  @ApiProperty({ example: 108.33194 })
  lng: number;
}
const formatI18n = (data: any): string => {
  if (!data) return '';
  if (typeof data === 'string') return data;
  if (typeof data === 'object' && data !== null) {
    // Ưu tiên Tiếng Việt -> Tiếng Anh -> các thứ tiếng khác
    return data.vi || data.en || data.jp || data.zh || data.ru || Object.values(data)[0] || '';
  }
  return String(data);
};

export class RestaurantResponse {
  @ApiProperty({ example: '65fc34e45d4f3b0012abcd11' })
  id: string;

  @ApiProperty({ example: 'Quán Cao lầu Thanh' })
  name: string;

  @ApiProperty({ example: '26 Thái Phiên, Minh An, Hội An' })
  address: string;

  @ApiProperty({ type: LocationResponse })
  location: LocationResponse;

  @ApiProperty({ example: '0905123456' })
  phoneNumber: string;

  @ApiProperty({ example: '07:00 - 22:00' })
  openingHours: string;

  @ApiProperty({ example: ['https://cdn.com/res.png'] })
  images: string[];

  @ApiProperty({ example: ['65fc34e45d4f3b0012abcd45'] })
  foods: string[];

  constructor(data: EntityDocument<Restaurant>) {
    this.id = data._id?.toString() || data.id;
    this.name = formatI18n(data.name);
    this.address = formatI18n(data.address);
    this.location = data.location;
    this.phoneNumber = data.phoneNumber || '';
    this.openingHours = data.openingHours || '';
    this.images = data.images || [];
    this.foods = data.foods ? data.foods.map(food => food.toString()) : [];
  }
}



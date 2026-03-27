import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsArray, IsMongoId, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { LocationDto } from '@/modules/Restaurants/dto/request/location.dto';

export class CreateRestaurantRequest {
  @ApiProperty({ example: 'Quán Cao lầu Thanh', description: 'Tên quán ăn' })
  @IsString()
  @IsNotEmpty({ message: 'Tên quán ăn không được để trống' })
  name: string;

  @ApiProperty({ example: '26 Thái Phiên, Minh An, Hội An', description: 'Địa chỉ quán ăn' })
  @IsString()
  @IsNotEmpty({ message: 'Địa chỉ quán không được để trống' })
  address: string;

  @ApiProperty({ type: LocationDto })
  @IsObject()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => LocationDto)
  location: LocationDto;

  @ApiPropertyOptional({ example: '0905123456', description: 'Số điện thoại' })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiPropertyOptional({ example: '07:00 - 22:00', description: 'Giờ mở cửa' })
  @IsOptional()
  @IsString()
  openingHours?: string;

  @ApiPropertyOptional({ example: ['https://cdn.com/restaurants/quan-thanh.png'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @ApiPropertyOptional({ example: ['65fc34e45d4f3b0012abcd45'] })
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  foods?: string[]; 
}
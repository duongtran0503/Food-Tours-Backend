import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsArray, IsMongoId, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { LocationDto } from '@/modules/Restaurants/dto/request/location.dto';
import { MultiLanguage } from '@/schemas/MultiLanguage';

export class CreateRestaurantRequest {
  @ApiProperty({ example: { vi: 'Quán Cao lầu Thanh', en: 'Thanh Cao Lau Restaurant' } })
  @IsObject()
  @ValidateNested()
  @Type(() => MultiLanguage)
  name: MultiLanguage;

  @ApiProperty({ example: { vi: '26 Thái Phiên, Hội An', en: '26 Thai Phien, Hoi An' } })
  @IsObject()
  @ValidateNested()
  @Type(() => MultiLanguage)
  address: MultiLanguage;

  @ApiPropertyOptional({
    example: { vi: 'Bánh mì đặc sản với pate và bơ béo ngậy', en: 'Special banh mi with pate and butter' }
  })
  @IsObject()
  @ValidateNested()
  @Type(() => MultiLanguage)
  description: MultiLanguage;

  @ApiPropertyOptional({ example: { vi: '07:00 - 22:00', en: '7 AM - 10 PM' } })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => MultiLanguage)
  openingHours?: MultiLanguage;

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
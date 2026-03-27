import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsArray, IsMongoId, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { UpdateLocationDto } from '@/modules/Restaurants/dto/request/location.dto';

export class UpdateRestaurantRequest {
  @ApiPropertyOptional({ example: 'Quán Cao lầu Thanh - CN2' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 'Hội An, Quảng Nam' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ type: UpdateLocationDto })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => UpdateLocationDto)
  location?: UpdateLocationDto;

  @ApiPropertyOptional({ example: '0905111222' })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiPropertyOptional({ example: '08:00 - 21:00' })
  @IsOptional()
  @IsString()
  openingHours?: string;

  @ApiPropertyOptional({ example: ['https://new-image.png'] })
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
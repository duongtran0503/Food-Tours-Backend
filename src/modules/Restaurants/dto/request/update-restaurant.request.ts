import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsArray, IsMongoId, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { UpdateLocationDto } from '@/modules/Restaurants/dto/request/location.dto';
import { MultiLanguage } from '@/schemas/MultiLanguage';

export class UpdateRestaurantRequest {
  @ApiPropertyOptional({ type: MultiLanguage })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => MultiLanguage)
  name?: MultiLanguage;

  @ApiPropertyOptional({ type: MultiLanguage })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => MultiLanguage)
  address?: MultiLanguage;

  @ApiPropertyOptional({ type: MultiLanguage })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => MultiLanguage)
  description?: MultiLanguage;

  @ApiPropertyOptional({ type: MultiLanguage })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => MultiLanguage)
  openingHours?: MultiLanguage;

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
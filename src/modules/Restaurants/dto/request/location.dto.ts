import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class LocationDto {
  @ApiProperty({ example: 15.87944, description: 'Vĩ độ (Latitude)' })
  @IsNumber()
  @IsNotEmpty({ message: 'Vĩ độ (lat) không được để trống' })
  lat: number;

  @ApiProperty({ example: 108.33194, description: 'Kinh độ (Longitude)' })
  @IsNumber()
  @IsNotEmpty({ message: 'Kinh độ (lng) không được để trống' })
  lng: number;
}

export class UpdateLocationDto {
  @ApiPropertyOptional({ example: 15.87944, description: 'Vĩ độ mới' })
  @IsNumber()
  @IsOptional()
  lat?: number;

  @ApiPropertyOptional({ example: 108.33194, description: 'Kinh độ mới' })
  @IsNumber()
  @IsOptional()
  lng?: number;
}
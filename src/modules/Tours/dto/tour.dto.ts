import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { MultiLanguage } from '@/schemas/MultiLanguage';
import { IsString, IsNumber, IsOptional, IsArray, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTourRequest {
  @ApiProperty({ example: { vi: 'Tour Khám Phá Phố Cổ', en: 'Old Quarter Discovery Tour' } })
  @IsObject()
  @ValidateNested()
  @Type(() => MultiLanguage)
  name: MultiLanguage;

  @ApiProperty({ example: { vi: 'Ăn sập Hội An trong nửa ngày', en: 'Eat all Hoi An in half a day' } })
  @IsObject()
  @ValidateNested()
  @Type(() => MultiLanguage)
  description: MultiLanguage;

  @ApiProperty({ example: 500000, description: 'Giá vé (VNĐ)' })
  @IsNumber()
  price: number;

  @ApiProperty({ example: '4 hours', description: 'Thời lượng tour' })
  @IsString()
  duration: string;

  @ApiPropertyOptional({ example: ['https://cdn.example.com/tour-ben-thanh.jpg'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @ApiPropertyOptional({ example: ['65fc34e45d4f3b0012abcd45'], description: 'Mảng chứa ID các quán ăn' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  restaurants?: string[]; 
}
    export class UpdateTourRequest extends PartialType(CreateTourRequest) {}
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class MultiLanguage {
    @ApiProperty({ example: 'Tên tiếng Việt' })
    @IsString()
    @IsNotEmpty()
    vi: string;

    @ApiProperty({ example: 'English Name' })
    @IsString()
    @IsOptional()
    en?: string;

    @ApiProperty({ example: 'Japanese Name' })
    @IsString()
    @IsOptional()
    jp?: string;

    @ApiProperty({ example: 'Chinese Name' })
    @IsString()
    @IsOptional()
    zh?: string;

    @ApiProperty({ example: 'Russian Name' })
    @IsString()
    @IsOptional()
    ru?: string;
}
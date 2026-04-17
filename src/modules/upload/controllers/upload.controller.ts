import { UploadService } from '@/modules/upload/services/upload.service';
import { Controller, Post, Delete, Body, UseInterceptors, UploadedFile, BadRequestException, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Uploads (Media Management)')
@ApiBearerAuth() 
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('image')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Tải lên hình ảnh (JPG, PNG, WebP...)' })
  @ApiBody({
    description: 'Tệp hình ảnh cần tải lên',
    schema: {
      type: 'object',
      properties: {
        file: { 
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Tải ảnh thành công',
    schema: { properties: { imageUrl: { type: 'string', example: 'https://res.cloudinary.com/demo/image/upload/v1234/sample.jpg' } } }
  })
  @ApiResponse({ status: 400, description: 'Chưa chọn tệp hình ảnh' })
  async uploadImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|webp)$/i }),
        ],
        fileIsRequired: true,
      }),
    ) file: Express.Multer.File
  ) {
    const result = await this.uploadService.uploadImage(file);
    return { imageUrl: result.secure_url };
  }

  @Delete('remove')
  @ApiOperation({ summary: 'Xóa file trên cloud (Cloudinary/S3)' })
  @ApiBody({ schema: { example: { publicId: 'food-tours/image_12345' } } })
  @ApiResponse({ status: 200, description: 'Xóa thành công' })
  async deleteFile(@Body('publicId') publicId: string) {
    if (!publicId) throw new BadRequestException('Vui lòng cung cấp publicId của file cần xóa');
    
    await this.uploadService.deleteFile(publicId); 
    
    return { message: 'Xóa tệp thành công', deletedId: publicId };
  }

  @Post('audio')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Tải lên tệp âm thanh (MP3, WAV...)' })
  @ApiBody({
    description: 'Tệp âm thanh cần tải lên',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Tải tệp âm thanh thành công',
    schema: { properties: { audioUrl: { type: 'string', example: 'https://res.cloudinary.com/demo/video/upload/v1234/sample.mp3' } } }
  })
  @ApiResponse({ status: 400, description: 'Chưa chọn tệp âm thanh' })
  async uploadAudio(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('Vui lòng chọn một tệp âm thanh!');
    
    const result = await this.uploadService.uploadAudio(file);
    return {
      audioUrl: result.secure_url, 
    };
  }
}
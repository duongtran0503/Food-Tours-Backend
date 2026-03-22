import { UploadService } from '@/modules/upload/services/upload.service';
import { Controller, Post, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('image')
  @UseInterceptors(FileInterceptor('file')) 
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('Vui lòng chọn một hình ảnh!');
    
    const result = await this.uploadService.uploadImage(file);
    return {
      imageUrl: result.secure_url, 
    };
  }

  @Post('audio')
  @UseInterceptors(FileInterceptor('file'))
  async uploadAudio(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('Vui lòng chọn một tệp âm thanh!');
    
    const result = await this.uploadService.uploadAudio(file);
    return {
      audioUrl: result.secure_url, 
    };
  }
}
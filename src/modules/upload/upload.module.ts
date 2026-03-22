import { UploadController } from '@/modules/upload/controllers/upload.controller';
import { CloudinaryProvider } from '@/modules/upload/providers/cloudinary.provider';
import { UploadService } from '@/modules/upload/services/upload.service';
import { Module } from '@nestjs/common';

@Module({
  controllers: [UploadController],
  providers: [CloudinaryProvider, UploadService],
  exports: [CloudinaryProvider, UploadService],
})
export class UploadModule {}
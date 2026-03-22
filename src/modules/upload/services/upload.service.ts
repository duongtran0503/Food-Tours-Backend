import { Injectable, BadRequestException } from '@nestjs/common';
import { v2 as cloudinary, UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';
import * as streamifier from 'streamifier';

@Injectable()
export class UploadService {
  
  async uploadImage(file: Express.Multer.File): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return this.uploadToCloudinary(file, 'foodievk/images', 'image');
  }

  async uploadAudio(file: Express.Multer.File): Promise<UploadApiResponse | UploadApiErrorResponse> {
    if (!file.mimetype.startsWith('audio/')) {
      throw new BadRequestException('Tệp tải lên không phải là file âm thanh hợp lệ!');
    }
    return this.uploadToCloudinary(file, 'foodievk/audios', 'video'); 
  }
  private uploadToCloudinary(
    file: Express.Multer.File,
    folder: string,
    resourceType: 'image' | 'video' | 'raw',
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: folder,
          resource_type: resourceType,
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }
}
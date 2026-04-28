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
  async deleteFile(publicId: string): Promise<any> {
    try {
      const isAudio = publicId.includes('foodievk/audios');
      const resourceType = isAudio ? 'video' : 'image';

      const result = await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
      
      if (result.result !== 'ok') {
        throw new BadRequestException(`Không thể xóa tệp. Trạng thái từ Cloudinary: ${result.result}`);
      }
      return result;
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException('Lỗi hệ thống khi tương tác với Cloudinary: ' + error.message);
      }
      throw new BadRequestException('Lỗi hệ thống không xác định khi tương tác với Cloudinary');
    }
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
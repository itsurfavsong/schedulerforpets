import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import { systemError } from '../errors/app.error';

@Injectable()
export class UploadService {
  constructor(private config: ConfigService) {
    cloudinary.config({
      cloud_name: this.config.getOrThrow('CLOUDINARY_CLOUD_NAME'),
      api_key: this.config.getOrThrow('CLOUDINARY_API_KEY'),
      api_secret: this.config.getOrThrow('CLOUDINARY_API_SECRET'),
    });
  }

  async uploadImage(file: Express.Multer.File, folder: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder }, (error: any, result) => {
          if (error) {
            reject(systemError(error.message || 'Cloudinary upload failed'));
          } else if (result) {
            resolve(result.secure_url);
          } else {
            reject(systemError('Cloudinary upload failed'));
          }
        })
        .end(file.buffer);
    });
  }

  async deleteImage(publicId: string): Promise<void> {
    await cloudinary.uploader.destroy(publicId);
  }
}
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';
import { IMediaProvider } from '../../interfaces/media.provide.type';
import { ImageType } from '../../enum/image.type.enum';

@Injectable()
export class CloudinaryProvider implements IMediaProvider {
  private readonly logger = new Logger(CloudinaryProvider.name);
  constructor(private config: ConfigService) {
    this.logger.debug('Cloudinary setup...');
    v2.config({
      cloud_name: this.config.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.config.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.config.get<string>('CLOUDINARY_API_SECRET'),
    });
  }

  async uploadFile(
    file: Buffer,
    type: ImageType,
  ): Promise<{ url: string; publicId: string } | null> {
    try {
      const response: UploadApiResponse = await new Promise(
        (resolve, reject) => {
          const uploadStream = v2.uploader.upload_stream(
            {
              resource_type: 'auto',
              folder: this.getFolder(type),
            },
            (error: UploadApiErrorResponse, result: UploadApiResponse) => {
              if (error) reject(error);
              else resolve(result);
            },
          );
          uploadStream.end(file);
        },
      );

      this.logger.debug('Image upload response: ', response.public_id);
      if (response.secure_url && response.public_id)
        return { url: response.secure_url, publicId: response.public_id };
      else return null;
    } catch (error) {
      this.logger.error('Failed to upload image: ', error);
      return null;
    }
  }

  private getFolder(type: ImageType): string | undefined {
    const folderMap: { [key in ImageType]: string } = {
      [ImageType.MOVIE]: 'CLOUDINARY_MOVIE_FOLDER',
    };

    return this.config.get<string>(
      folderMap[type] || 'CLOUDINARY_DEFAULT_FOLDER',
    );
  }

  async delete(publicId: string): Promise<void> {
    await v2.uploader.destroy(publicId);
    this.logger.debug('Image deleted successfully');
  }
}

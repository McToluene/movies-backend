import { Injectable } from '@nestjs/common';
import { MediaProviderFactory } from '../shared/factory/media.provider.factory';
import { MediaProviderEnum } from '../shared/interfaces/media.provide.type';
import { ImageType } from 'src/shared/enum/image.type.enum';

@Injectable()
export class MediaService {
  constructor(private providerFactory: MediaProviderFactory) {}

  async upload(
    provider: MediaProviderEnum,
    file: Buffer,
    imageType: ImageType,
  ): Promise<{ url: string; publicId: string } | null> {
    const mediaProvider = this.providerFactory.getDriveProvider(provider);
    return mediaProvider.uploadFile(file, imageType);
  }
}

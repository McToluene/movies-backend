import { Injectable } from '@nestjs/common';

import { CloudinaryProvider } from '../utils/cloudinary/cloudinary.util';
import { MediaProviderEnum } from '../interfaces/media.provide.type';

@Injectable()
export class MediaProviderFactory {
  constructor(private readonly cloudinaryProvider: CloudinaryProvider) {}
  public getDriveProvider(
    provider: MediaProviderEnum = MediaProviderEnum.CLOUDINARY,
  ) {
    switch (provider) {
      case MediaProviderEnum.CLOUDINARY:
        return this.cloudinaryProvider;
      default:
        throw new Error(`Unknown media provider: ${provider}`);
    }
  }
}

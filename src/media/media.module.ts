import { Module } from '@nestjs/common';
import { MediaService } from './media.service';
import { ConfigModule } from '@nestjs/config';
import { CloudinaryProvider } from '../shared/utils/cloudinary/cloudinary.util';
import { MediaProviderFactory } from '../shared/factory/media.provider.factory';

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [MediaService, CloudinaryProvider, MediaProviderFactory],
  exports: [MediaService],
})
export class MediaModule {}

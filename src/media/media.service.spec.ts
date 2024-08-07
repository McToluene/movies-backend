import { Test, TestingModule } from '@nestjs/testing';
import { MediaService } from './media.service';
import { MediaProviderFactory } from '../shared/factory/media.provider.factory';
import { MediaProviderEnum } from '../shared/interfaces/media.provide.type';
import { ImageType } from '../shared/enum/image.type.enum';

describe('MediaService', () => {
  let service: MediaService;
  let providerFactory: MediaProviderFactory;

  const mockMediaProvider = {
    uploadFile: jest.fn().mockResolvedValue({
      url: 'http://example.com/image.jpg',
      publicId: '123456',
    }),
  };

  const mockProviderFactory = {
    getDriveProvider: jest.fn().mockReturnValue(mockMediaProvider),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MediaService,
        {
          provide: MediaProviderFactory,
          useValue: mockProviderFactory,
        },
      ],
    }).compile();

    service = module.get<MediaService>(MediaService);
    providerFactory = module.get<MediaProviderFactory>(MediaProviderFactory);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('upload', () => {
    it('should upload a file and return its URL and public ID', async () => {
      const provider = MediaProviderEnum.CLOUDINARY;
      const file = Buffer.from('test file');
      const imageType = ImageType.MOVIE;

      const result = await service.upload(provider, file, imageType);

      expect(result).toEqual({
        url: 'http://example.com/image.jpg',
        publicId: '123456',
      });
      expect(providerFactory.getDriveProvider).toHaveBeenCalledWith(provider);
      expect(mockMediaProvider.uploadFile).toHaveBeenCalledWith(
        file,
        imageType,
      );
    });

    it('should return null if upload fails', async () => {
      mockMediaProvider.uploadFile.mockResolvedValueOnce(null);

      const provider = MediaProviderEnum.CLOUDINARY;
      const file = Buffer.from('test file');
      const imageType = ImageType.MOVIE;

      const result = await service.upload(provider, file, imageType);

      expect(result).toBeNull();
      expect(providerFactory.getDriveProvider).toHaveBeenCalledWith(provider);
      expect(mockMediaProvider.uploadFile).toHaveBeenCalledWith(
        file,
        imageType,
      );
    });
  });
});

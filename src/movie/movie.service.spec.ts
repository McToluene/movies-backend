import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { MovieService } from './movie.service';
import { MediaService } from '../media/media.service';
import { Movie } from './schema/movie.schema';
import { MovieQueryDto } from './dto/movie-query.dto';

describe('MovieService', () => {
  let service: MovieService;

  const mockMovieModel = {
    findOne: jest.fn(),
    aggregate: jest.fn(),
    create: jest.fn(),
  };

  const mockMediaService = {
    upload: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MovieService,
        { provide: getModelToken(Movie.name), useValue: mockMovieModel },
        { provide: MediaService, useValue: mockMediaService },
      ],
    }).compile();

    service = module.get<MovieService>(MovieService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getMovies', () => {
    it('should return data and total from the aggregation result', async () => {
      const mockQuery: MovieQueryDto = { page: 1, limit: 10, title: 'Test' };
      const mockAggregationResult = [{ data: [], total: 0 }];

      mockMovieModel.aggregate.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(mockAggregationResult),
      });

      const result = await service.getMovies(mockQuery);

      expect(result).toEqual({ data: [], total: 0 });
    });
  });
});

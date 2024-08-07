import { Test, TestingModule } from '@nestjs/testing';
import { MovieController } from './movie.controller';
import { MovieService } from './movie.service';
import { JwtAuthGuard } from '../shared/guard/jwt-auth.guard';
import { MovieDto } from './dto/movie.dto';
import { MovieQueryDto } from './dto/movie-query.dto';
import { Movie } from './schema/movie.schema';
import { ConflictException } from '@nestjs/common';

describe('MovieController', () => {
  let controller: MovieController;
  let service: MovieService;

  const mockMovieService = {
    addMovie: jest.fn(),
    getMovies: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MovieController],
      providers: [{ provide: MovieService, useValue: mockMovieService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<MovieController>(MovieController);
    service = module.get<MovieService>(MovieService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('addMovie', () => {
    it('should call MovieService.addMovie and return the result', async () => {
      const mockRequest = { user: { _id: '123', email: 'test@test.com' } };
      const mockFile = new File([''], 'filename');
      const mockMovieDto: MovieDto = { title: 'Test Movie', year: '2020' };
      const mockMovie: Movie = {
        title: 'Test Movie',
        year: '2020',
        url: 'http://example.com',
      } as Movie;

      mockMovieService.addMovie.mockResolvedValueOnce(mockMovie);

      const result = await controller.addMovie(
        mockRequest,
        mockFile,
        mockMovieDto,
      );

      expect(service.addMovie).toHaveBeenCalledWith(
        mockRequest.user,
        mockFile,
        mockMovieDto,
      );
      expect(result).toEqual(mockMovie);
    });

    it('should throw an error when MovieService.addMovie fails', async () => {
      const mockRequest = { user: { _id: '123', email: 'test@test.com' } };
      const mockFile = new File([''], 'filename');
      const mockMovieDto: MovieDto = { title: 'Test Movie', year: '2020' };

      mockMovieService.addMovie.mockRejectedValueOnce(
        new ConflictException('Movie: Test Movie already exist'),
      );

      await expect(
        controller.addMovie(mockRequest, mockFile, mockMovieDto),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('getMovies', () => {
    it('should call MovieService.getMovies and return the result', async () => {
      const mockQuery: MovieQueryDto = { page: 1, limit: 10, title: 'Test' };
      const mockMovies = { data: [], total: 0 };

      mockMovieService.getMovies.mockResolvedValueOnce(mockMovies);

      const result = await controller.getCareAides(mockQuery);

      expect(service.getMovies).toHaveBeenCalledWith(mockQuery);
      expect(result).toEqual(mockMovies);
    });

    it('should call MovieService.getMovies with query without optional fields', async () => {
      const mockQuery: MovieQueryDto = { page: 1, limit: 10 };
      const mockMovies = { data: [], total: 0 };

      mockMovieService.getMovies.mockResolvedValueOnce(mockMovies);

      const result = await controller.getCareAides(mockQuery);

      expect(service.getMovies).toHaveBeenCalledWith(mockQuery);
      expect(result).toEqual(mockMovies);
    });

    it('should throw an error when MovieService.getMovies fails', async () => {
      const mockQuery: MovieQueryDto = { page: 1, limit: 10 };

      mockMovieService.getMovies.mockRejectedValueOnce(
        new Error('Service error'),
      );

      await expect(controller.getCareAides(mockQuery)).rejects.toThrow(Error);
    });
  });
});

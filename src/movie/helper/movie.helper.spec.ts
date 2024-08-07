import { MovieHelper } from './movie.helper';
import { MovieQueryDto } from '../dto/movie-query.dto';

describe('MovieHelper', () => {
  describe('movieQuery', () => {
    it('should construct the correct MongoDB aggregation pipeline', () => {
      const query: MovieQueryDto = {
        page: 1,
        limit: 10,
        title: 'Inception',
        year: '2010',
      };

      const expectedPipeline = [
        {
          $match: {
            title: { $regex: 'Inception', $options: 'i' },
            year: { $regex: '2010', $options: 'i' },
          },
        },
        {
          $facet: {
            data: [{ $skip: 0 }, { $limit: 10 }],
            total: [{ $count: 'count' }],
          },
        },
        { $unwind: { path: '$total', preserveNullAndEmptyArrays: true } },
        { $addFields: { total: { $ifNull: ['$total.count', 0] } } },
      ];

      const result = MovieHelper.movieQuery(query);

      expect(result).toEqual(expectedPipeline);
    });

    it('should handle an empty query object', () => {
      const query: MovieQueryDto = {
        page: 1,
        limit: 10,
      };

      const expectedPipeline = [
        { $match: {} },
        {
          $facet: {
            data: [{ $skip: 0 }, { $limit: 10 }],
            total: [{ $count: 'count' }],
          },
        },
        { $unwind: { path: '$total', preserveNullAndEmptyArrays: true } },
        { $addFields: { total: { $ifNull: ['$total.count', 0] } } },
      ];

      const result = MovieHelper.movieQuery(query);

      expect(result).toEqual(expectedPipeline);
    });

    it('should handle pagination correctly', () => {
      const query: MovieQueryDto = {
        page: 2,
        limit: 5,
        title: 'Inception',
      };

      const expectedPipeline = [
        {
          $match: {
            title: { $regex: 'Inception', $options: 'i' },
          },
        },
        {
          $facet: {
            data: [{ $skip: 5 }, { $limit: 5 }],
            total: [{ $count: 'count' }],
          },
        },
        { $unwind: { path: '$total', preserveNullAndEmptyArrays: true } },
        { $addFields: { total: { $ifNull: ['$total.count', 0] } } },
      ];

      const result = MovieHelper.movieQuery(query);

      expect(result).toEqual(expectedPipeline);
    });

    it('should handle multiple query parameters', () => {
      const query: MovieQueryDto = {
        page: 1,
        limit: 10,
        title: 'Inception',
        year: '2010',
      };

      const expectedPipeline = [
        {
          $match: {
            title: { $regex: 'Inception', $options: 'i' },
            year: { $regex: '2010', $options: 'i' },
          },
        },
        {
          $facet: {
            data: [{ $skip: 0 }, { $limit: 10 }],
            total: [{ $count: 'count' }],
          },
        },
        { $unwind: { path: '$total', preserveNullAndEmptyArrays: true } },
        { $addFields: { total: { $ifNull: ['$total.count', 0] } } },
      ];

      const result = MovieHelper.movieQuery(query);

      expect(result).toEqual(expectedPipeline);
    });

    it('should handle query parameters with special characters', () => {
      const query: MovieQueryDto = {
        page: 1,
        limit: 10,
        title: 'Inception!',
      };

      const expectedPipeline = [
        {
          $match: {
            title: { $regex: 'Inception!', $options: 'i' },
          },
        },
        {
          $facet: {
            data: [{ $skip: 0 }, { $limit: 10 }],
            total: [{ $count: 'count' }],
          },
        },
        { $unwind: { path: '$total', preserveNullAndEmptyArrays: true } },
        { $addFields: { total: { $ifNull: ['$total.count', 0] } } },
      ];

      const result = MovieHelper.movieQuery(query);

      expect(result).toEqual(expectedPipeline);
    });
  });
});

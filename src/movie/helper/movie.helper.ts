import { MovieQueryDto } from '../dto/movie-query.dto';

export class MovieHelper {
  private constructor() {}

  static movieQuery(query: MovieQueryDto): any[] {
    const { page, limit, ...restQuery } = query;
    const skip = (page - 1) * limit;
    const match: any = {};

    for (const key in restQuery) {
      if (restQuery.hasOwnProperty(key)) {
        const value = restQuery[key];
        match[key] = { $regex: value, $options: 'i' };
      }
    }

    return [
      { $match: match },
      {
        $facet: {
          data: [{ $skip: skip }, { $limit: limit }],
          total: [{ $count: 'count' }],
        },
      },
      { $unwind: { path: '$total', preserveNullAndEmptyArrays: true } },
      { $addFields: { total: { $ifNull: ['$total.count', 0] } } },
    ];
  }
}

import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MediaService } from '../media/media.service';
import { MediaProviderEnum } from '../shared/interfaces/media.provide.type';
import { ImageType } from '../shared/enum/image.type.enum';
import { MovieDto } from './dto/movie.dto';
import { Movie } from './schema/movie.schema';
import { User } from '../user/schema/user.schema';
import { MovieQueryDto } from './dto/movie-query.dto';
import { MovieHelper } from './helper/movie.helper';

@Injectable()
export class MovieService {
  constructor(
    @InjectModel(Movie.name)
    private movieModel: Model<Movie>,
    private mediaService: MediaService,
  ) {}

  async addMovie(user: User, file: File, data: MovieDto): Promise<Movie> {
    const movie = await this.getMovieByTitle(data.title, user);
    if (movie)
      throw new ConflictException(`Movie: ${data.title} already exist`);

    const arrayBuffer = await file.arrayBuffer();
    const response = await this.mediaService.upload(
      MediaProviderEnum.CLOUDINARY,
      Buffer.from(arrayBuffer),
      ImageType.MOVIE,
    );

    const createdMovie = {
      ...data,
      user,
      url: response?.url,
    };

    return this.movieModel.create(createdMovie);
  }

  private async getMovieByTitle(title: string, user: User) {
    return this.movieModel.findOne({ title, user });
  }

  async getMovies(
    query: MovieQueryDto,
  ): Promise<{ data: Movie[]; total: number }> {
    const [result] = await this.movieModel
      .aggregate(MovieHelper.movieQuery(query))
      .exec();
    const { data, total } = result;
    return { data, total };
  }
}

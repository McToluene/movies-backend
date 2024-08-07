import { Module } from '@nestjs/common';
import { MovieService } from './movie.service';
import { MovieController } from './movie.controller';
import { Movie, MovieSchema } from './schema/movie.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { MediaModule } from 'src/media/media.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Movie.name, schema: MovieSchema }]),
    MediaModule,
  ],
  providers: [MovieService],
  controllers: [MovieController],
})
export class MovieModule {}

import {
  Body,
  Controller,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Request,
  Get,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MovieDto } from './dto/movie.dto';
import { MovieService } from './movie.service';
import { JwtAuthGuard } from '../shared/guard/jwt-auth.guard';
import { MovieQueryDto } from './dto/movie-query.dto';
import { Movie } from './schema/movie.schema';

@Controller('movie')
export class MovieController {
  constructor(private movieService: MovieService) {}

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async addMovie(
    @Request() req,
    @UploadedFile() file,
    @Body() data: MovieDto,
  ): Promise<Movie> {
    return this.movieService.addMovie(req.user, file, data);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getCareAides(
    @Query() query: MovieQueryDto,
  ): Promise<{ data: Movie[]; total: number }> {
    return this.movieService.getMovies(query);
  }
}

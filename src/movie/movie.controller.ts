import {
  Body,
  Controller,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Request,
  Get,
  Query,
  Post,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MovieDto } from './dto/movie.dto';
import { MovieService } from './movie.service';
import { JwtAuthGuard } from '../shared/guard/jwt-auth.guard';
import { MovieQueryDto } from './dto/movie-query.dto';
import { Movie } from './schema/movie.schema';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('movie')
@Controller('movie')
export class MovieController {
  constructor(private movieService: MovieService) {}

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @Post()
  @ApiResponse({
    status: 201,
    description: 'The movie has been successfully created.',
  })
  @ApiResponse({ status: 401, description: 'No token was provided.' })
  @ApiResponse({ status: 400, description: 'Required fields are not provided' })
  async addMovie(
    @Request() req,
    @UploadedFile() file: Express.Multer.File,
    @Body() data: MovieDto,
  ): Promise<Movie> {
    if (!file) throw new BadRequestException('Please add file');
    return this.movieService.addMovie(req.user, file, data);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiResponse({
    status: 200,
    description: 'The movies has been fetched succesfully.',
  })
  @ApiResponse({ status: 401, description: 'No token was provided.' })
  async getMovies(
    @Query() query: MovieQueryDto,
  ): Promise<{ data: Movie[]; total: number }> {
    return this.movieService.getMovies(query);
  }
}

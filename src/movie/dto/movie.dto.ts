import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class MovieDto {
  @IsString()
  @ApiProperty({
    description: 'Title of the movie',
    example: 'Inception',
  })
  title: string;

  @IsString()
  @ApiProperty({
    description: 'Year the movie was released',
    example: '2010',
  })
  year: string;
}

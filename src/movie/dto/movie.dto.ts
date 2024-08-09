import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class MovieDto {
  @IsString()
  @ApiProperty()
  title: string;

  @IsString()
  @ApiProperty()
  year: string;
}

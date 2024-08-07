import { IsString } from 'class-validator';

export class MovieDto {
  @IsString()
  title: string;

  @IsString()
  year: string;
}

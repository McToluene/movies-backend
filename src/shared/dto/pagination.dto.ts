import { Type } from 'class-transformer';
import { IsNumber, Min } from 'class-validator';

export class PaginationDto {
  @Min(1)
  @Type(() => Number)
  @IsNumber()
  page: number;

  @Min(10)
  @Type(() => Number)
  @IsNumber()
  limit: number;
}

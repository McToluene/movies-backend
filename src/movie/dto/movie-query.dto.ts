import { IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '../../shared/dto/pagination.dto';
import { ApiProperty } from '@nestjs/swagger';

export class MovieQueryDto extends PaginationDto {
  @IsOptional()
  @IsString()
  @ApiProperty()
  title?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  year?: string;
}

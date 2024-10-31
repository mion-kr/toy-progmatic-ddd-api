import { Type } from 'class-transformer';
import { IsNumber, Min } from 'class-validator';

export class FindAllDto {
  /**
   * 페이지
   * @example 1
   */
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page: number;

  /**
   * 페이지 당 개수
   * @example 10
   */
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit: number;
}

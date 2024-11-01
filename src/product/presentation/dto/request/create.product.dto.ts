import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateProductFishDto } from './create-product-fish.dto';

export class CreateProductDto {
  /**
   * 상품명
   * @example "서해 낚시 투어"
   */
  @IsString()
  @IsNotEmpty()
  name: string;

  /**
   * 가격
   * @example 50000
   */
  @IsNumber()
  @IsNotEmpty()
  price: number;

  /**
   * 설명
   * @example "서해에서 즐기는 낚시 투어입니다."
   */
  @IsString()
  @IsNotEmpty()
  description: string;

  /**
   * 운영 시간
   * @example "09:00-18:00"
   */
  @IsString()
  @IsNotEmpty()
  operationTime: string;

  /**
   * 최대 인원
   * @example 10
   */
  @IsNumber()
  @IsNotEmpty()
  headCount: number;

  /**
   * 최소 인원
   * @example 4
   */
  @IsNumber()
  @IsNotEmpty()
  minHeadCount: number;

  /**
   * 파트너스 ID
   * @example "partners-id"
   */
  @IsString()
  @IsNotEmpty()
  partnersId: string;

  /**
   * 상품 어종
   */
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateProductFishDto)
  @IsOptional()
  productFishes?: CreateProductFishDto[];
}

import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { ProductDisplayStatus } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsOptional, ValidateNested } from 'class-validator';
import { CreateProductDto } from './create.product.dto';
import { UpdateProductFishDto } from './update-product-fish.dto';

export class UpdateProductDto extends PartialType(
  PickType(CreateProductDto, [
    'name',
    'price',
    'description',
    'operationTime',
    'headCount',
    'minHeadCount',
  ] as const),
) {
  @ApiProperty({
    description: '노출 여부',
    enum: ProductDisplayStatus,
  })
  @IsEnum(ProductDisplayStatus)
  @IsOptional()
  displayStatus?: ProductDisplayStatus;

  @ApiProperty({
    description: '상품 어종',
    type: [UpdateProductFishDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateProductFishDto)
  fishes?: UpdateProductFishDto[];
}

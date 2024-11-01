import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { CreateProductFishDto } from './create-product-fish.dto';

export class UpdateProductFishDto extends PartialType(
  PickType(CreateProductFishDto, ['fishId']),
) {
  @ApiProperty({
    description: '상품 어종 ID',
    example: 'cm2x1h14a0001pt7zlzb95vuk',
    required: false,
  })
  @IsString()
  @IsOptional()
  id?: string;

  @ApiProperty({
    description: '삭제 여부',
    example: false,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isDeleted?: boolean;
}

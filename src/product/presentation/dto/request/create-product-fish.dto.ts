import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateProductFishDto {
  @ApiProperty({
    description: '어종 ID',
    example: 'fish-1',
  })
  @IsString()
  fishId: string;

  @ApiProperty({
    description: '상품 ID',
    example: 'product-1',
  })
  @IsString()
  productId: string;
}

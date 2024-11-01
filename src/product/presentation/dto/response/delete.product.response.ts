import { PickType } from '@nestjs/swagger';
import { ProductDisplayStatus } from '@prisma/client';
import { ProductEntity } from '../../../domain/product.entity';
import { CreateProductDto } from '../request/create.product.dto';

export class DeleteProductResponse extends PickType(CreateProductDto, [
  'name',
  'price',
  'description',
  'operationTime',
  'headCount',
  'minHeadCount',
  'partnersId',
] as const) {
  id: string;

  displayStatus: ProductDisplayStatus;

  constructor(partial: ProductEntity) {
    super();
    this.id = partial.id;
    this.name = partial.name;
    this.price = partial.price;
    this.description = partial.description;
    this.operationTime = partial.operationTime;
    this.headCount = partial.headCount;
    this.minHeadCount = partial.minHeadCount;
    this.displayStatus = partial.displayStatus;
    this.partnersId = partial.partnersId;
  }
}

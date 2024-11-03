import { PickType } from '@nestjs/swagger';
import { ProductEntity } from '../../../domain/product.entity';
import { UpdateProductDto } from '../request/update.product.dto';

export class UpdateProductResponse extends PickType(UpdateProductDto, [
  'name',
  'price',
  'description',
  'operationTime',
  'headCount',
  'minHeadCount',
  'displayStatus',
  'fishes',
] as const) {
  id: string;

  partnersId: string;

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
    this.fishes = partial.fishes;
  }
}

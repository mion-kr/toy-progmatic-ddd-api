import { PickType } from '@nestjs/swagger';
import { ProductDisplayStatus } from '@prisma/client';
import { ProductFishEntity } from '../../../domain/product-fish.entity';
import { ProductEntity } from '../../../domain/product.entity';
import { CreateProductFishDto } from '../request/create-product-fish.dto';
import { CreateProductDto } from '../request/create.product.dto';

export class CreateProductResponse extends PickType(CreateProductDto, [
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
  fishes: CreateProductFishResponse[];

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
    this.fishes = partial?.fishes?.map(
      (productFish) => new CreateProductFishResponse(productFish),
    );
  }
}

export class CreateProductFishResponse extends PickType(CreateProductFishDto, [
  'fishId',
] as const) {
  id: string;

  constructor(partial: ProductFishEntity) {
    super();
    this.id = partial.id;
    this.fishId = partial.fishId;
  }
}

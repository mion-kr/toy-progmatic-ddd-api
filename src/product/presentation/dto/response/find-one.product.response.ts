import { ProductEntity } from '../../../domain/product.entity';
import { CreateProductResponse } from './create.product.response';

export class FindOneProductResponse {
  product: CreateProductResponse;

  constructor(product: ProductEntity) {
    this.product = new CreateProductResponse(product);
  }
}

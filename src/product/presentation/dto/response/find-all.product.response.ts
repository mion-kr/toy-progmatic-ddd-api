import { ProductEntity } from '../../../domain/product.entity';
import { CreateProductResponse } from './create.product.response';

export class FindAllProductResponse {
  products: CreateProductResponse[];
  totalCount: number;

  constructor(products: ProductEntity[], totalCount: number) {
    this.products = products.map(
      (product) => new CreateProductResponse(product),
    );
    this.totalCount = totalCount;
  }
}

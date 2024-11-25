import { ProductEntity } from '../../../domain/product.entity';

export class DeleteProductResponse {
  id: string;

  constructor(partial: Pick<ProductEntity, 'id'>) {
    this.id = partial.id;
  }
}

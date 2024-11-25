import { ProductEntity } from './product.entity';

export interface IProductRepository {
  findAll(dto: {
    page: number;
    limit: number;
  }): Promise<{ datas: ProductEntity[]; count: number }>;
  findById(id: string): Promise<ProductEntity | null>;
  create(product: ProductEntity): Promise<ProductEntity>;
  update(product: ProductEntity): Promise<ProductEntity>;
}

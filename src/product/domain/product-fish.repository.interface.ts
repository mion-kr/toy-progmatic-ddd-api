import { ProductFishEntity } from './product-fish.entity';

export interface IProductFishRepository {
  findAllByProductId(productId: string): Promise<ProductFishEntity[]>;
  findById(id: string): Promise<ProductFishEntity | null>;
  createMany(productFishes: ProductFishEntity[]): Promise<ProductFishEntity[]>;
  update(productFish: ProductFishEntity): Promise<ProductFishEntity>;
  deleteManyByProductId(productId: string, deletedBy: string): Promise<void>;
}

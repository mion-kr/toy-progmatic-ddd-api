import { createId } from '@paralleldrive/cuid2';
import { ProductFish } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';
import {
  AbstractOptionalProps,
  AbstractSchema,
} from '../../shared/schema/abstract.schema';

@Exclude()
export class ProductFishEntity extends AbstractSchema implements ProductFish {
  private _id: string;
  private _productId: string;
  private _fishId: string;

  private constructor(props: ProductFish) {
    super(props);
    this._id = props.id;
    this._productId = props.productId;
    this.setFishId(props.fishId);
  }

  static createNew(
    props: Omit<
      ProductFish,
      'id' | 'createdAt' | 'updatedBy' | 'updatedAt' | 'deletedBy' | 'deletedAt'
    > &
      AbstractOptionalProps,
  ): ProductFishEntity {
    const entity = new ProductFishEntity({
      id: createId(),
      ...props,
      createdAt: new Date(),
      updatedBy: props.createdBy,
      updatedAt: new Date(),
      deletedAt: undefined,
      deletedBy: undefined,
    });
    return entity;
  }

  static fromPersistence(props: ProductFish): ProductFishEntity {
    return new ProductFishEntity(props);
  }

  async update(props: Partial<ProductFish>): Promise<void> {
    this._fishId = props?.fishId;
    this.setUpdatedInfo(props.updatedBy);
  }

  async delete(deletedBy: string): Promise<void> {
    this.setDeletedInfo(deletedBy);
  }

  private setFishId(fishId: string) {
    if (!fishId) {
      throw new Error('fishId is required');
    }
    this._fishId = fishId;
  }

  @Expose()
  get id(): string {
    return this._id;
  }

  @Expose()
  get productId(): string {
    return this._productId;
  }

  @Expose()
  get fishId(): string {
    return this._fishId;
  }
}

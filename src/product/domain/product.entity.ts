import { createId } from '@paralleldrive/cuid2';
import { Product, ProductDisplayStatus, ProductFish } from '@prisma/client';
import { Expose } from 'class-transformer';
import {
  AbstractOptionalProps,
  AbstractSchema,
} from '../../shared/schema/abstract.schema';
import { ProductFishEntity } from './product-fish.entity';

@Expose()
export class ProductEntity extends AbstractSchema implements Product {
  private _id: string;
  private _name: string;
  private _price: number;
  private _description: string;
  private _operationTime: string;
  private _headCount: number;
  private _minHeadCount: number;
  private _displayStatus: ProductDisplayStatus;
  private _userId: string;
  private _fishes: ProductFishEntity[];

  private constructor(props: Product & { fishes?: ProductFishEntity[] }) {
    super(props);
    this._id = props.id;
    this.setUserId(props.userId);
    this._name = props.name;
    this._price = props.price;
    this._description = props.description;
    this._operationTime = props.operationTime;
    this.setHeadCount(props.headCount);
    this._minHeadCount = props.minHeadCount;
    this._displayStatus = props.displayStatus;
    this._fishes = props.fishes;
  }

  static createNew(
    props: Omit<
      Product,
      | 'id'
      | 'displayStatus'
      | 'createdAt'
      | 'updatedBy'
      | 'updatedAt'
      | 'deletedBy'
      | 'deletedAt'
    > &
      AbstractOptionalProps,
  ): ProductEntity {
    const entity = new ProductEntity({
      id: createId(),
      ...props,
      createdBy: props.createdBy,
      createdAt: new Date(),
      updatedBy: props.createdBy,
      updatedAt: new Date(),
      deletedAt: undefined,
      deletedBy: undefined,
      displayStatus: ProductDisplayStatus.DISPLAY,
    });
    return entity;
  }

  static fromPersistence(
    props: Product & { fishes?: ProductFish[] },
  ): ProductEntity {
    const entity = new ProductEntity({
      ...props,
      fishes: props.fishes?.map(ProductFishEntity.fromPersistence),
    });
    return entity;
  }

  async update(props: Partial<Product>): Promise<void> {
    this._name = props?.name;
    this._price = props?.price;
    this._description = props?.description;
    this._operationTime = props?.operationTime;
    this._headCount = props?.headCount;
    this._minHeadCount = props?.minHeadCount;
    this._displayStatus = props?.displayStatus;

    this.setUpdatedInfo(props.updatedBy);
  }

  async delete(deletedBy: string): Promise<void> {
    this.setDeletedInfo(deletedBy);
  }

  private setUserId(userId: string) {
    if (!userId) {
      throw new Error('userId is required');
    }
    this._userId = userId;
  }

  private setHeadCount(headCount: number) {
    if (!headCount) {
      throw new Error('headCount is required');
    }
    this._headCount = headCount;
  }

  @Expose()
  get id(): string {
    return this._id;
  }

  @Expose()
  get name(): string {
    return this._name;
  }

  @Expose()
  get price(): number {
    return this._price;
  }

  @Expose()
  get description(): string {
    return this._description;
  }

  @Expose()
  get operationTime(): string {
    return this._operationTime;
  }

  @Expose()
  get headCount(): number {
    return this._headCount;
  }

  @Expose()
  get minHeadCount(): number {
    return this._minHeadCount;
  }

  @Expose()
  get displayStatus(): ProductDisplayStatus {
    return this._displayStatus;
  }

  @Expose()
  get userId(): string {
    return this._userId;
  }

  @Expose()
  get fishes(): ProductFishEntity[] {
    return this._fishes;
  }
}

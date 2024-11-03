import { Product, ProductDisplayStatus } from '@prisma/client';
import { Expose } from 'class-transformer';
import * as cuid from 'cuid';
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
  private _partnersId: string;
  private _fishes: ProductFishEntity[];

  private constructor(props: Product) {
    super(props);
    this._id = props.id;
    this.setPartnersId(props.partnersId);
    this._name = props.name;
    this._price = props.price;
    this._description = props.description;
    this._operationTime = props.operationTime;
    this.setHeadCount(props.headCount);
    this._minHeadCount = props.minHeadCount;
    this._displayStatus = props.displayStatus;
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
      id: cuid(),
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

  static fromPersistence(props: Product): ProductEntity {
    return new ProductEntity(props);
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

  private setPartnersId(partnersId: string) {
    if (!partnersId) {
      throw new Error('partnersId is required');
    }
    this._partnersId = partnersId;
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
  get partnersId(): string {
    return this._partnersId;
  }

  @Expose()
  get fishes(): ProductFishEntity[] {
    return this._fishes;
  }

  set fishes(fishes: ProductFishEntity[]) {
    this._fishes = fishes;
  }
}
import { BadRequestException } from '@nestjs/common';
import { Schedule, ScheduleFish, ScheduleStatus } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';
import * as cuid from 'cuid';
import {
  AbstractOptionalProps,
  AbstractSchema,
} from '../../shared/schema/abstract.schema';
import { ScheduleFishEntity } from './schedule-fish.entity';

@Exclude()
export class ScheduleEntity extends AbstractSchema implements Schedule {
  private _id: string;
  private _productId: string;
  private _fishingDate: Date;
  private _name: string;
  private _price: number;
  private _description: string;
  private _operationTime: string;
  private _allocationTime: string;
  private _headCount: number;
  private _minHeadCount: number;
  private _status: ScheduleStatus;
  private _fishes: ScheduleFishEntity[];

  private constructor(props: Schedule & { fishes?: ScheduleFishEntity[] }) {
    super(props);
    this._id = props.id;
    this._productId = props.productId;
    this._fishingDate = props.fishingDate;
    this._name = props.name;
    this._price = props.price;
    this._description = props.description;
    this._operationTime = props.operationTime;
    this._allocationTime = props.allocationTime;
    this._headCount = props.headCount;
    this._minHeadCount = props.minHeadCount;
    this._status = props.status;
    this._fishes = props.fishes;
  }

  static createNew(
    props: Omit<
      Schedule,
      | 'id'
      | 'status'
      | 'createdAt'
      | 'updatedBy'
      | 'updatedAt'
      | 'deletedBy'
      | 'deletedAt'
    > &
      AbstractOptionalProps,
  ): ScheduleEntity {
    const entity = new ScheduleEntity({
      id: cuid(),
      ...props,
      status: ScheduleStatus.OPEN,
      createdAt: new Date(),
      updatedBy: props.createdBy,
      updatedAt: new Date(),
      deletedAt: undefined,
      deletedBy: undefined,
    });

    entity.validateCreate();
    return entity;
  }

  static fromPersistence(
    props: Schedule & { fishes?: ScheduleFish[] },
  ): ScheduleEntity {
    const entity = new ScheduleEntity({
      ...props,
      fishes: props.fishes?.map(ScheduleFishEntity.fromPersistence),
    });
    return entity;
  }

  async update(props: Partial<Schedule>): Promise<void> {
    this._name = props.name;
    this._price = props.price;
    this._description = props.description;
    this._operationTime = props.operationTime;
    this._allocationTime = props.allocationTime;
    this._headCount = props.headCount;
    this._minHeadCount = props.minHeadCount;

    this.setUpdatedInfo(props.updatedBy);
  }

  async delete(deletedBy: string): Promise<void> {
    this.setDeletedInfo(deletedBy);
  }

  private validateCreate(): void {
    if (this._headCount < this._minHeadCount) {
      throw new BadRequestException('최소 인원 수보다 적습니다.');
    }

    if (this._fishingDate < new Date()) {
      throw new BadRequestException('날짜가 오늘보다 이전입니다.');
    }
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
  get fishingDate(): Date {
    return this._fishingDate;
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
  get allocationTime(): string {
    return this._allocationTime;
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
  get status(): ScheduleStatus {
    return this._status;
  }

  @Expose()
  get fishes(): ScheduleFishEntity[] {
    return this._fishes;
  }
}

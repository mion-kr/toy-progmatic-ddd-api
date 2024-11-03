import { ScheduleFish } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';
import * as cuid from 'cuid';
import {
  AbstractOptionalProps,
  AbstractSchema,
} from '../../shared/schema/abstract.schema';

@Exclude()
export class ScheduleFishEntity extends AbstractSchema implements ScheduleFish {
  private _id: string;
  private _scheduleId: string;
  private _fishId: string;

  private constructor(props: ScheduleFish) {
    super(props);
    this._id = props.id;
    this._scheduleId = props.scheduleId;
    this.setFishId(props.fishId);
  }

  static createNew(
    props: Omit<
      ScheduleFish,
      'id' | 'createdAt' | 'updatedBy' | 'updatedAt' | 'deletedBy' | 'deletedAt'
    > &
      AbstractOptionalProps,
  ): ScheduleFishEntity {
    const entity = new ScheduleFishEntity({
      id: cuid(),
      ...props,
      createdAt: new Date(),
      updatedBy: props.createdBy,
      updatedAt: new Date(),
      deletedAt: undefined,
      deletedBy: undefined,
    });
    return entity;
  }

  static fromPersistence(props: ScheduleFish): ScheduleFishEntity {
    return new ScheduleFishEntity(props);
  }

  async update(props: Partial<ScheduleFish>): Promise<void> {
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
  get scheduleId(): string {
    return this._scheduleId;
  }

  @Expose()
  get fishId(): string {
    return this._fishId;
  }
}

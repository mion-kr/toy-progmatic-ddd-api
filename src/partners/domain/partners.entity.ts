import { Partners } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';
import * as cuid from 'cuid';
import {
  AbstractOptionalProps,
  AbstractSchema,
} from '../../shared/schema/abstract.schema';

@Exclude()
export class PartnersEntity extends AbstractSchema implements Partners {
  private _id: string;
  private _name: string;
  private _businessNumber: string;

  private constructor(props: Partners) {
    super(props);
    this._id = props.id;
    this._name = props.name;
    this._businessNumber = props.businessNumber;
  }

  static createNew(
    props: Omit<
      Partners,
      | 'id'
      | 'createdAt'
      | 'updatedAt'
      | 'deletedAt'
      | 'createdBy'
      | 'updatedBy'
      | 'deletedBy'
    > &
      AbstractOptionalProps,
  ): PartnersEntity {
    const entity = new PartnersEntity({
      id: cuid(),
      ...props,
      createdBy: props.createdBy,
      createdAt: new Date(),
      updatedBy: props.createdBy,
      updatedAt: new Date(),
      deletedAt: undefined,
      deletedBy: undefined,
    });
    return entity;
  }

  static fromPersistence(props: Partners): PartnersEntity {
    return new PartnersEntity(props);
  }

  async update(props: Partial<Partners>): Promise<void> {
    this._name = props?.name;
    this._businessNumber = props?.businessNumber;
    this.setUpdatedInfo(props.updatedBy);
  }

  async delete(deletedBy: string): Promise<void> {
    this.setDeletedInfo(deletedBy);
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
  get businessNumber(): string {
    return this._businessNumber;
  }
}

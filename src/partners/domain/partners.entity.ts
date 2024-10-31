import { Partners } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';
import { AbstractSchema } from '../../shared/schema/abstract.schema';

@Exclude()
export class PartnersEntity extends AbstractSchema implements Partners {
  private _id: string;
  private _name: string;
  private _businessNumber: string;

  private constructor(props: Partial<Partners>) {
    super(props);
    this._id = props.id;
    this._name = props.name;
    this._businessNumber = props.businessNumber;
  }

  static create(props: Partial<Partners>): PartnersEntity {
    const entity = new PartnersEntity(props);
    entity.setCreatedInfo(props.createdBy);
    return entity;
  }

  async update(props: Partial<Partners>): Promise<void> {
    this._name = props?.name;
    this._businessNumber = props?.businessNumber;
    this.setUpdatedInfo(props.updatedBy);
  }

  async delete(props: Partial<Partners>): Promise<void> {
    this.setDeletedInfo(props.deletedBy);
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

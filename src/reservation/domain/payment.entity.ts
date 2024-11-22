import { BadRequestException } from '@nestjs/common';
import { Payment } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';
import * as cuid from 'cuid';
import {
  AbstractOptionalProps,
  AbstractSchema,
} from '../../shared/schema/abstract.schema';

@Exclude()
export class PaymentEntity extends AbstractSchema implements Payment {
  private _id: string;
  private _reservationId: string;
  private _price: number;

  private constructor(props: Payment) {
    super(props);
    this._id = props.id;
    this._reservationId = props.reservationId;
    this._price = props.price;
  }

  static createNew(
    props: Omit<
      Payment,
      'id' | 'createdAt' | 'updatedBy' | 'updatedAt' | 'deletedAt' | 'deletedBy'
    > &
      AbstractOptionalProps,
  ): PaymentEntity {
    const entity = new PaymentEntity({
      id: cuid(),
      ...props,
      createdAt: new Date(),
      updatedBy: props.createdBy,
      updatedAt: new Date(),
      deletedAt: undefined,
      deletedBy: undefined,
    });

    entity.validateCreate();
    return entity;
  }

  static fromPersistence(props: Payment): PaymentEntity {
    return new PaymentEntity(props);
  }

  private validateCreate(): void {
    if (this._price <= 0) {
      throw new BadRequestException('결제 금액은 0보다 커야 합니다.');
    }
  }

  @Expose()
  get id(): string {
    return this._id;
  }

  @Expose()
  get reservationId(): string {
    return this._reservationId;
  }

  @Expose()
  get price(): number {
    return this._price;
  }
}

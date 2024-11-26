import { BadRequestException } from '@nestjs/common';
import { createId } from '@paralleldrive/cuid2';
import {
  Payment,
  Reservation,
  ReservationStatus,
  Schedule,
} from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';
import { ScheduleEntity } from '../../schedule/domain/schedule.entity';
import {
  AbstractOptionalProps,
  AbstractSchema,
} from '../../shared/schema/abstract.schema';
import { PaymentCompletedEvent } from '../application/events/payment-completed.event-handler';
import { PaymentEntity } from './payment.entity';

@Exclude()
export class ReservationEntity extends AbstractSchema implements Reservation {
  private _id: string;
  private _scheduleId: string;
  private _headCount: number;
  private _userId: string;
  private _status: ReservationStatus;
  private _schedule: ScheduleEntity;
  private _payment: PaymentEntity;

  private constructor(
    props: Reservation & {
      schedule?: ScheduleEntity;
      payment?: PaymentEntity;
    },
  ) {
    super(props);
    this._id = props.id;
    this._scheduleId = props.scheduleId;
    this._headCount = props.headCount;
    this._userId = props.userId;
    this._status = props.status;
    this._schedule = props.schedule;
    this._payment = props.payment;
  }

  static createNew(
    props: Omit<
      Reservation,
      | 'id'
      | 'createdAt'
      | 'updatedBy'
      | 'updatedAt'
      | 'deletedAt'
      | 'deletedBy'
      | 'status'
    > &
      AbstractOptionalProps,
  ): ReservationEntity {
    const entity = new ReservationEntity({
      id: createId(),
      ...props,
      status: ReservationStatus.PAYMENT_WAITING,
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
    props: Reservation & {
      schedule?: Schedule;
      payment?: Payment;
    },
  ): ReservationEntity {
    const entity = new ReservationEntity({
      ...props,
      schedule: props.schedule
        ? ScheduleEntity.fromPersistence(props.schedule)
        : undefined,
      payment: props.payment
        ? PaymentEntity.fromPersistence(props.payment)
        : undefined,
    });
    return entity;
  }

  async completePayment(userId: string) {
    this.validateOwner(userId);
    this.validateIsPaymentWaiting();

    this._status = ReservationStatus.COMPLETED;
    this.setUpdatedInfo(userId);

    this.apply(new PaymentCompletedEvent(this));
  }

  async cancel(userId: string) {
    this.validateOwner(userId);
    this.validateIsCanceled();

    this._status = ReservationStatus.CANCELLED;
    this.setUpdatedInfo(userId);
  }

  async delete(deletedBy: string): Promise<void> {
    this.validateOwner(deletedBy);
    if (this._status === ReservationStatus.COMPLETED) {
      throw new BadRequestException('완료된 예약은 삭제할 수 없습니다.');
    }

    this.setDeletedInfo(deletedBy);
  }

  private validateCreate(): void {
    if (this._headCount <= 0) {
      throw new BadRequestException('인원 수는 0보다 커야 합니다.');
    }
  }

  private validateOwner(userId: string): void {
    if (this._userId !== userId) {
      throw new BadRequestException('예약자만 수정할 수 있습니다.');
    }
  }

  private validateIsPaymentWaiting(): void {
    if (this._status !== ReservationStatus.PAYMENT_WAITING) {
      throw new BadRequestException('결제 전 예약만 가능합니다.');
    }
  }

  private validateIsCanceled(): void {
    if (this._status === ReservationStatus.CANCELLED) {
      throw new BadRequestException('이미 취소된 예약입니다.');
    }
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
  get headCount(): number {
    return this._headCount;
  }

  @Expose()
  get userId(): string {
    return this._userId;
  }

  @Expose()
  get status(): ReservationStatus {
    return this._status;
  }

  @Expose()
  get payment(): PaymentEntity {
    return this._payment;
  }

  @Expose()
  get schedule(): ScheduleEntity {
    return this._schedule;
  }
}

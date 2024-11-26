import { BadRequestException, NotFoundException } from '@nestjs/common';
import { createId } from '@paralleldrive/cuid2';
import {
  Reservation,
  ReservationStatus,
  Schedule,
  ScheduleFish,
  ScheduleStatus,
} from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';
import * as dayjs from 'dayjs';
import { ReservationEntity } from '../../reservation/domain/reservation.entity';
import {
  AbstractOptionalProps,
  AbstractSchema,
} from '../../shared/schema/abstract.schema';
import { ScheduleFishEntity } from './schedule-fish.entity';

/**
 * 스케줄의 도메인 범위
 * 스케줄 + 스케줄 어종
 */
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
  private _reservations: ReservationEntity[];

  private constructor(
    props: Schedule & {
      fishes?: ScheduleFishEntity[];
      reservations?: ReservationEntity[];
    },
  ) {
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
    this._reservations = props.reservations;
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
      id: createId(),
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
    props: Schedule & { fishes?: ScheduleFish[]; reservations?: Reservation[] },
  ): ScheduleEntity {
    const entity = new ScheduleEntity({
      ...props,
      reservations: props.reservations?.map(ReservationEntity.fromPersistence),
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

    if (this.isPassedFishingDate()) {
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

  @Expose()
  get reservations(): ReservationEntity[] {
    return this._reservations;
  }

  /**
   * 예약 인원 수(대기 + 완료 포함)
   */
  @Expose()
  get totalReservationHeadCount(): number {
    return (
      this._reservations?.reduce((acc, curr) => acc + curr.headCount, 0) || 0
    );
  }

  /**
   * 완료된 예약 인원 수
   */
  @Expose()
  get totalCompletedReservationHeadCount(): number {
    return this._reservations
      .filter(
        (reservation) => reservation.status === ReservationStatus.COMPLETED,
      )
      .reduce((acc, curr) => acc + curr.headCount, 0);
  }

  /**
   * 예약 전 유효성 검사
   */
  validateForReservation(headCount: number): void {
    if (this.isPassedFishingDate()) {
      throw new BadRequestException('출조일이 지났습니다.');
    }

    if (this.isOverbookingForReservation(headCount)) {
      throw new BadRequestException('예약 가능 인원을 초과했습니다.');
    }
  }

  /**
   * 결제 전 유효성 검사
   */
  validateForPaymentReservation(reservationId: string): void {
    const reservation = this._reservations.find(
      (reservation) => reservation.id === reservationId,
    );

    if (!reservation) {
      throw new NotFoundException('예약 정보를 찾을 수 없습니다.');
    }

    if (this.isPassedFishingDate()) {
      throw new BadRequestException('출조일이 지났습니다.');
    }

    if (this.isOverbookingForPaymentReservation(reservation.headCount)) {
      throw new BadRequestException('예약 가능 인원을 초과했습니다.');
    }
  }

  /**
   * 예약 오버부킹 여부 (대기 + 완료 포함)
   */
  private isOverbookingForReservation(headCount: number): boolean {
    return this.totalReservationHeadCount + headCount > this._headCount;
  }

  /**
   * 출조일이 지났는지(내부 로직용)
   */
  private isPassedFishingDate(): boolean {
    const scheduleFishingDate = dayjs(this.fishingDate)
      .subtract(1, 'day')
      .startOf('day');
    const today = dayjs().startOf('day');
    return (
      scheduleFishingDate.isSame(today) || scheduleFishingDate.isBefore(today)
    );
  }

  /**
   * 결제전 오버부킹 여부
   */
  private isOverbookingForPaymentReservation(headCount: number): boolean {
    return (
      this.totalCompletedReservationHeadCount + headCount > this._headCount
    );
  }
}

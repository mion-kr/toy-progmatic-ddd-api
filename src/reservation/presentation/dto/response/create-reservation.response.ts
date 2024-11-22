import { PickType } from '@nestjs/swagger';
import { PaymentEntity } from '../../../domain/payment.entity';
import { ReservationEntity } from '../../../domain/reservation.entity';
import { CreatePaymentDto } from '../request/create-payment.dto';
import { CreateReservationDto } from '../request/create-reservation.dto';

export class CreateReservationResponse extends PickType(CreateReservationDto, [
  'headCount',
  'scheduleId',
] as const) {
  id: string;
  status: string;
  createdAt: Date;
  payment: PaymentResponse;

  constructor(partial: ReservationEntity) {
    super();
    this.id = partial.id;
    this.scheduleId = partial.scheduleId;
    this.status = partial.status;
    this.createdAt = partial.createdAt;
    this.headCount = partial.headCount;
    this.payment = partial.payment
      ? new PaymentResponse(partial?.payment)
      : null;
  }
}

export class PaymentResponse extends PickType(CreatePaymentDto, [
  'price',
] as const) {
  id: string;

  constructor(partial: PaymentEntity) {
    super();
    this.id = partial.id;
    this.price = partial.price;
  }
}

import { PaymentEntity } from './payment.entity';

export interface IPaymentRepository {
  findById(id: string): Promise<PaymentEntity | null>;
  findByReservationId(reservationId: string): Promise<PaymentEntity | null>;
  create(payment: PaymentEntity): Promise<PaymentEntity>;
}

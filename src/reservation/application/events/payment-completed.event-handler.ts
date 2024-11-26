import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ReservationEntity } from '../../domain/reservation.entity';

export class PaymentCompletedEvent {
  constructor(public readonly reservation: ReservationEntity) {}
}

@EventsHandler(PaymentCompletedEvent)
export class PaymentCompletedEventHandler
  implements IEventHandler<PaymentCompletedEvent>
{
  async handle(event: PaymentCompletedEvent): Promise<void> {
    console.log('결제 완료 이벤트 발생');
  }
}

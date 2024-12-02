import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ReservationEntity } from '../../domain/reservation.entity';

export class CanceledEvent {
  constructor(public readonly reservation: ReservationEntity) {}
}

@EventsHandler(CanceledEvent)
export class CanceledEventHandler
  implements IEventHandler<CanceledEvent>
{
  async handle(event: CanceledEvent) {
    console.log('예약 취소 이벤트 발생');
  }
  
}
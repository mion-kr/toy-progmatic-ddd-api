import { PickType } from '@nestjs/swagger';
import { ReservationEntity } from '../../../domain/reservation.entity';
import { CreateReservationResponse } from './create-reservation.response';

export class DeleteReservationResponse extends PickType(
  CreateReservationResponse,
  ['id'] as const,
) {
  constructor(partial: Pick<ReservationEntity, 'id'>) {
    super();
    this.id = partial.id;
  }
}

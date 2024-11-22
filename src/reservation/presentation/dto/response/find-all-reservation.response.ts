import { ReservationEntity } from '../../../domain/reservation.entity';
import { CreateReservationResponse } from './create-reservation.response';

export class FindAllReservationResponse {
  datas: CreateReservationResponse[];

  count: number;

  constructor(reservations: ReservationEntity[], count: number) {
    this.datas = reservations.map(
      (reservation) => new CreateReservationResponse(reservation),
    );
    this.count = count;
  }
}

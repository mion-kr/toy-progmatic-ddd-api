import { Injectable, NotFoundException } from '@nestjs/common';
import { ReservationEntity } from '../domain/reservation.entity';

@Injectable()
export class CommonReservationService {
  async validateNotFoundReservation(reservation: ReservationEntity) {
    if (!reservation) {
      throw new NotFoundException('예약을 찾을 수 없습니다.');
    }
  }
}

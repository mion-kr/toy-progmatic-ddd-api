import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ReservationRepository } from '../infrastructure/reservation.repository';
import { FindAllReservationDto } from '../presentation/dto/request/find-all-reservation.dto';
import { CommonReservationService } from './common.reservation.service';

@Injectable()
export class ReservationService {
  constructor(
    private readonly reservationRepository: ReservationRepository,
    private readonly commonReservationService: CommonReservationService,
  ) {}


  /**
   * 예약 목록 조회
   */
  async findAll(dto: FindAllReservationDto) {
    const { datas, count } = await this.reservationRepository.findAll(dto);
    return { datas, count }; }

  /**
   * 예약 조회
   */
  async findById(id: string, tx?: Prisma.TransactionClient) {
    const reservation = await this.reservationRepository.findById(id, tx);
    await this.commonReservationService.validateNotFoundReservation(
      reservation,
    );
    return reservation;
  }
}

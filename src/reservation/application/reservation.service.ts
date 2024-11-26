import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CommonScheduleService } from '../../schedule/application/common-schedule.service';
import { ScheduleService } from '../../schedule/application/schedule.service';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { CommonUserService } from '../../user/application/common.user.service';
import { UserService } from '../../user/application/user.service';
import { ReservationEntity } from '../domain/reservation.entity';
import { ReservationRepository } from '../infrastructure/reservation.repository';
import { CreatePaymentDto } from '../presentation/dto/request/create-payment.dto';
import { CreateReservationDto } from '../presentation/dto/request/create-reservation.dto';
import { FindAllReservationDto } from '../presentation/dto/request/find-all-reservation.dto';
import { CommonReservationService } from './common.reservation.service';
import { PaymentService } from './payment.service';

@Injectable()
export class ReservationService {
  constructor(
    private readonly reservationRepository: ReservationRepository,
    private readonly commonReservationService: CommonReservationService,

    private readonly scheduleService: ScheduleService,
    private readonly commonScheduleService: CommonScheduleService,

    private readonly userService: UserService,
    private readonly commonUserService: CommonUserService,

    private readonly paymentService: PaymentService,

    private readonly prismaService: PrismaService,
  ) {}

  /**
   * 예약 생성
   */
  async create(dto: CreateReservationDto, userId: string) {
    return await this.prismaService.$transaction(async (tx) => {
      const schedule = await this.scheduleService.findById(dto.scheduleId, tx);
      await this.commonScheduleService.validateNotFoundSchedule(schedule);
      await this.commonScheduleService.validateScheduleStatus(schedule);

      const user = await this.userService.findOneBySnsId(userId, tx);
      await this.commonUserService.validateNotFoundUser(user);

      const reservation = ReservationEntity.createNew({
        ...dto,
        userId,
        createdBy: userId,
      });

      await this.reservationRepository.create(reservation, tx);

      return await this.reservationRepository.findById(reservation.id, tx);
    });
  }

  /**
   * 예약 목록 조회
   */
  async findAll(dto: FindAllReservationDto) {
    const { datas, count } = await this.reservationRepository.findAll(dto);
    return { datas, count };
  }

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

  /**
   * 예약 결제
   */
  async payment(id: string, dto: CreatePaymentDto, userId: string) {
    return await this.prismaService.$transaction(async (tx) => {
      const reservation = await this.reservationRepository.findById(id, tx);
      await this.commonReservationService.validateNotFoundReservation(
        reservation,
      );

      // 예약 결제
      await reservation.completePayment(userId);
      const result = await this.reservationRepository.update(reservation, tx);

      // 결제 생성
      await this.paymentService.create(result.id, dto, userId, tx);

      return await this.reservationRepository.findById(id, tx);
    });
  }

  /**
   * 예약 취소
   */
  async cancel(id: string, userId: string) {
    return await this.prismaService.$transaction(async (tx) => {
      const reservation = await this.findById(id, tx);
      await this.commonReservationService.validateNotFoundReservation(
        reservation,
      );

      await reservation.cancel(userId);
      await this.reservationRepository.update(reservation, tx);

      return await this.reservationRepository.findById(id, tx);
    });
  }
}

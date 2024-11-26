import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { ScheduleService } from '../../../schedule/application/schedule.service';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import { ReservationEntity } from '../../domain/reservation.entity';
import { ReservationRepository } from '../../infrastructure/reservation.repository';
import { CreatePaymentDto } from '../../presentation/dto/request/create-payment.dto';
import { CommonReservationService } from '../common.reservation.service';
import { PaymentService } from '../payment.service';

export class PaymentReservationCommand {
  constructor(
    public readonly props: {
      id: string;
      dto: CreatePaymentDto;
      userId: string;
    },
  ) {}
}

@CommandHandler(PaymentReservationCommand)
export class PaymentReservationCommandHandler
  implements ICommandHandler<PaymentReservationCommand>
{
  constructor(
    private readonly reservationRepository: ReservationRepository,
    private readonly commonReservationService: CommonReservationService,
    private readonly scheduleService: ScheduleService,
    private readonly paymentService: PaymentService,
    private readonly prismaService: PrismaService,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: PaymentReservationCommand): Promise<any> {
    const { id, dto, userId } = command.props;

    return await this.prismaService.$transaction(async (tx) => {
      // 1. 예약 조회 및 이벤트 컨텍스트 설정
      const reservation = await this.getReservationWithEventContext(id, tx);

      // 2. 스케줄 유효성 검사
      await this.validateScheduleAvailability(reservation, tx);

      // 3. 결제 처리 및 저장
      await this.processPayment(reservation, userId, tx, dto);

      // 4. 이벤트 발행
      reservation.commit();

      // 5. 최종 예약 정보 반환
      return await this.reservationRepository.findById(id, tx);
    });
  }

  /**
   * 예약 조회 및 이벤트 컨텍스트 설정
   */
  private async getReservationWithEventContext(id: string, tx) {
    let reservation = await this.reservationRepository.findById(id, tx);
    await this.commonReservationService.validateNotFoundReservation(
      reservation,
    );

    // 이벤트 발행을 위한 컨텍스트 설정
    reservation = this.publisher.mergeObjectContext(reservation);
    return reservation;
  }

  /**
   * 스케줄 유효성 검사
   */
  private async validateScheduleAvailability(
    reservation: ReservationEntity,
    tx,
  ) {
    const schedule = await this.scheduleService.findById(
      reservation.scheduleId,
      tx,
    );
    // 결제 전 스케줄 유효성 검사 (예: 예약 가능 인원 초과 여부)
    schedule.validateForPaymentReservation(reservation.id);
  }

  /**
   * 결제 처리 및 관련 정보 저장
   */
  private async processPayment(
    reservation: ReservationEntity,
    userId: string,
    tx,
    dto: CreatePaymentDto,
  ) {
    // 예약 상태를 결제 완료로 변경
    await reservation.completePayment(userId);

    // 변경된 예약 정보 저장
    const result = await this.reservationRepository.update(reservation, tx);

    // 결제 정보 생성
    await this.paymentService.create(result.id, dto, userId, tx);
  }
}

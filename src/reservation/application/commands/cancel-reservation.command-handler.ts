import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import { ReservationEntity } from '../../domain/reservation.entity';
import { ReservationRepository } from '../../infrastructure/reservation.repository';
import { CommonReservationService } from '../common.reservation.service';

export class CancelReservationCommand {
  constructor(
    public readonly props: {
      id: string;
      userId: string;
    },
  ) {}
}

@CommandHandler(CancelReservationCommand)
export class CancelReservationCommandHandler
  implements ICommandHandler<CancelReservationCommand>
{
  constructor(
    private readonly reservationRepository: ReservationRepository,
    private readonly commonReservationService: CommonReservationService,
    private readonly prismaService: PrismaService,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: CancelReservationCommand): Promise<any> {
    const { id, userId } = command.props;

    return await this.prismaService.$transaction(async (tx) => {
      // 1. 예약 조회 및 이벤트 컨텍스트 설정
      const reservation = await this.getReservationWithEventContext(id, tx);

      // 2. 취소 처리
      await this.processCancel(reservation, userId, tx);

      // 3. 이벤트 발행
      reservation.commit();

      // 4. 최종 예약 정보 반환
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
   * 예약 취소 처리
   */
  private async processCancel(
    reservation: ReservationEntity,
    userId: string,
    tx,
  ) {
    await reservation.cancel(userId);
    await this.reservationRepository.update(reservation, tx);
  }
}

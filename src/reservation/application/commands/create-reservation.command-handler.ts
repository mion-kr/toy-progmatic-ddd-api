import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { CommonScheduleService } from '../../../schedule/application/common-schedule.service';
import { ScheduleService } from '../../../schedule/application/schedule.service';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import { ReservationEntity } from '../../domain/reservation.entity';
import { ReservationRepository } from '../../infrastructure/reservation.repository';
import { CreateReservationDto } from '../../presentation/dto/request/create-reservation.dto';

export class CreateReservationCommand {
  constructor(
    public readonly props: {
      dto: CreateReservationDto
      userId: string;
    },
  ) {}
}

@CommandHandler(CreateReservationCommand)
export class CreateReservationCommandHandler
  implements ICommandHandler<CreateReservationCommand>
{
  constructor(
    private readonly reservationRepository: ReservationRepository,

    private readonly scheduleService: ScheduleService,
    private readonly commonScheduleService: CommonScheduleService,

    private readonly prismaService: PrismaService,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: CreateReservationCommand): Promise<any> {
    const { dto, userId } = command.props;

    return await this.prismaService.$transaction(async (tx) => {
      const schedule = await this.scheduleService.findById(dto.scheduleId, tx);
      await this.commonScheduleService.validateNotFoundSchedule(schedule);
      await this.commonScheduleService.validateScheduleStatus(schedule);

      schedule.validateForReservation(dto.headCount);

      const reservation = ReservationEntity.createNew({
        ...dto,
        userId,
        createdBy: userId,
      });

      await this.reservationRepository.create(reservation, tx);

      return await this.reservationRepository.findById(reservation.id, tx);    });
  }
}

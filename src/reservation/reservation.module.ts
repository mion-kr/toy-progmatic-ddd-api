import { Module } from '@nestjs/common';
import { ScheduleModule } from '../schedule/schedule.module';
import { PrismaModule } from '../shared/prisma/prisma.module';
import { UserModule } from '../user/user.module';
import { CommonReservationService } from './application/common.reservation.service';
import { PaymentService } from './application/payment.service';
import { ReservationService } from './application/reservation.service';
import { PaymentRepository } from './infrastructure/payment.repository';
import { ReservationRepository } from './infrastructure/reservation.repository';
import { ReservationController } from './presentation/reservation.controller';

@Module({
  imports: [ScheduleModule, UserModule, PrismaModule],
  controllers: [ReservationController],
  providers: [
    ReservationService,
    CommonReservationService,
    ReservationRepository,

    PaymentService,
    PaymentRepository,
  ],
  exports: [ReservationService, CommonReservationService],
})
export class ReservationModule {}

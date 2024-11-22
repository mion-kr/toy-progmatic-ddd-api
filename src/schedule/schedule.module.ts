import { Module } from '@nestjs/common';
import { ProductModule } from '../product/product.module';
import { PrismaModule } from '../shared/prisma/prisma.module';
import { CommonScheduleService } from './application/common-schedule.service';
import { ScheduleFishService } from './application/schedule-fish.service';
import { ScheduleService } from './application/schedule.service';
import { ScheduleFishRepository } from './infrastructure/schedule-fish.repository';
import { ScheduleRepository } from './infrastructure/schedule.repository';
import { ScheduleController } from './presentation/schedule.controller';

@Module({
  imports: [PrismaModule, ProductModule],
  controllers: [ScheduleController],
  providers: [
    ScheduleService,
    ScheduleRepository,
    CommonScheduleService,
    ScheduleFishService,
    ScheduleFishRepository,
  ],
  exports: [ScheduleService, CommonScheduleService],
})
export class ScheduleModule {}

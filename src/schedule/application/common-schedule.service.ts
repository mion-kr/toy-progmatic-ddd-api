import { Injectable, NotFoundException } from '@nestjs/common';
import { ScheduleStatus } from '@prisma/client';
import { ScheduleEntity } from '../domain/schedule.entity';

@Injectable()
export class CommonScheduleService {
  async validateNotFoundSchedule(schedule: ScheduleEntity) {
    if (!schedule) {
      throw new NotFoundException('스케줄을 찾을 수 없습니다.');
    }
  }

  async validateScheduleStatus(schedule: ScheduleEntity) {
    if (schedule.status === ScheduleStatus.CLOSE) {
      throw new NotFoundException('마감된 스케줄입니다.');
    }
  }
}

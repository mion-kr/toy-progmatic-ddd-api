import { ScheduleEntity } from '../../../domain/schedule.entity';
import { CreateScheduleResponse } from './create-schedule.response';

export class FindOneScheduleResponse {
  data: CreateScheduleResponse;

  constructor(schedule: ScheduleEntity) {
    this.data = new CreateScheduleResponse(schedule);
  }
}

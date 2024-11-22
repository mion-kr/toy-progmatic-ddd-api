import { ScheduleEntity } from '../../../domain/schedule.entity';
import { CreateScheduleResponse } from './create-schedule.response';

export class FindAllScheduleResponse {
  datas: CreateScheduleResponse[];

  count: number;

  constructor(schedules: ScheduleEntity[], count: number) {
    this.datas = schedules.map(
      (schedule) => new CreateScheduleResponse(schedule),
    );
    this.count = count;
  }
}

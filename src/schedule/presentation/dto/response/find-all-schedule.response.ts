import { Exclude, Expose, Type } from 'class-transformer';
import { ScheduleEntity } from '../../../domain/schedule.entity';
import { CreateScheduleResponse } from './create-schedule.response';

@Exclude()
export class FindAllScheduleResponse {
  @Expose()
  @Type(() => CreateScheduleResponse)
  datas: CreateScheduleResponse[];

  @Expose()
  count: number;

  constructor(schedules: ScheduleEntity[], count: number) {
    this.datas = schedules.map(
      (schedule) => new CreateScheduleResponse(schedule),
    );
    this.count = count;
  }
}

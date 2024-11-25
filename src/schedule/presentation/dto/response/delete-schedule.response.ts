import { PickType } from '@nestjs/swagger';
import { ScheduleEntity } from '../../../domain/schedule.entity';
import { CreateScheduleResponse } from './create-schedule.response';

export class DeleteScheduleResponse extends PickType(CreateScheduleResponse, [
  'id',
] as const) {
  constructor(partial: Pick<ScheduleEntity, 'id'>) {
    super();
    this.id = partial.id;
  }
}

import { ScheduleFishEntity } from './schedule-fish.entity';

export interface IScheduleFishRepository {
  findAllByScheduleId(scheduleId: string): Promise<ScheduleFishEntity[]>;
  findById(id: string): Promise<ScheduleFishEntity | null>;
  createMany(
    scheduleFishes: ScheduleFishEntity[],
  ): Promise<ScheduleFishEntity[]>;
  update(scheduleFish: ScheduleFishEntity): Promise<ScheduleFishEntity>;
  deleteManyByScheduleId(scheduleId: string, deletedBy: string): Promise<void>;
}

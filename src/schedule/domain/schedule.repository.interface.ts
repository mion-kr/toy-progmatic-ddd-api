import { ScheduleEntity } from './schedule.entity';

export interface IScheduleRepository {
  findAll(dto: {
    page: number;
    limit: number;
  }): Promise<{ datas: ScheduleEntity[]; count: number }>;
  findById(id: string): Promise<ScheduleEntity | null>;
  findByProductId(productId: string): Promise<ScheduleEntity[]>;
  create(schedule: ScheduleEntity): Promise<ScheduleEntity>;
  update(schedule: ScheduleEntity): Promise<ScheduleEntity>;
}

import { PickType } from '@nestjs/swagger';
import { ScheduleFishEntity } from '../../../domain/schedule-fish.entity';
import { ScheduleEntity } from '../../../domain/schedule.entity';
import { CreateScheduleFishDto } from '../request/create-schedule-fish.dto';
import { CreateScheduleDto } from '../request/create-schedule.dto';

export class CreateScheduleResponse extends PickType(CreateScheduleDto, [
  'name',
  'price',
  'description',
  'operationTime',
  'allocationTime',
  'headCount',
  'minHeadCount',
  'fishingDate',
  'productId',
] as const) {
  id: string;
  fishes: CreateScheduleFishResponse[];

  constructor(partial: ScheduleEntity) {
    super();
    this.id = partial.id;
    this.name = partial.name;
    this.price = partial.price;
    this.description = partial.description;
    this.operationTime = partial.operationTime;
    this.allocationTime = partial.allocationTime;
    this.headCount = partial.headCount;
    this.minHeadCount = partial.minHeadCount;
    this.fishingDate = partial.fishingDate;
    this.productId = partial.productId;
    this.fishes = partial?.fishes?.map(
      (scheduleFish) => new CreateScheduleFishResponse(scheduleFish),
    );
  }
}

export class CreateScheduleFishResponse extends PickType(
  CreateScheduleFishDto,
  ['fishId'] as const,
) {
  id: string;

  constructor(partial: ScheduleFishEntity) {
    super();
    this.id = partial.id;
    this.fishId = partial.fishId;
  }
}

import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsOptional, ValidateNested } from 'class-validator';
import { CreateScheduleDto } from './create-schedule.dto';
import { UpdateScheduleFishDto } from './update-schedule-fish.dto';

export class UpdateScheduleDto extends PartialType(
  PickType(CreateScheduleDto, [
    'name',
    'price',
    'description',
    'operationTime',
    'allocationTime',
    'headCount',
    'minHeadCount',
    'fishingDate',
  ] as const),
) {
  @ApiProperty({
    description: '스케줄 어종',
    type: [UpdateScheduleFishDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateScheduleFishDto)
  fishes?: UpdateScheduleFishDto[];
}

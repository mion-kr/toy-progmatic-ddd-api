import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateScheduleFishDto } from './create-schedule-fish.dto';

export class CreateScheduleDto {
  @ApiProperty({
    description: '상품 ID',
    example: 'product-id',
  })
  @IsString()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({
    description: '낚시 날짜',
    example: '2024-03-20',
  })
  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  fishingDate: Date;

  @ApiProperty({
    description: '스케줄명',
    example: '서해 낚시 투어 3월 20일',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: '가격',
    example: 50000,
  })
  @IsNumber()
  price: number;

  @ApiProperty({
    description: '설명',
    example: '서해에서 즐기는 낚시 투어입니다.',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: '운영 시간',
    example: '09:00-18:00',
  })
  @IsString()
  @IsNotEmpty()
  operationTime: string;

  @ApiProperty({
    description: '배정 시간',
    example: '08:30',
  })
  @IsString()
  @IsNotEmpty()
  allocationTime: string;

  @ApiProperty({
    description: '최대 인원',
    example: 10,
  })
  @IsNumber()
  headCount: number;

  @ApiProperty({
    description: '최소 인원',
    example: 4,
  })
  @IsNumber()
  minHeadCount: number;

  @ApiProperty({
    description: '스케줄 어종',
    type: [CreateScheduleFishDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateScheduleFishDto)
  @IsOptional()
  scheduleFishes?: CreateScheduleFishDto[];
}

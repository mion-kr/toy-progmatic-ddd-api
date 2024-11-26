import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateReservationDto {
  /**
   * 스케줄 ID
   * @example "schedule-1"
   */
  @IsString()
  @IsNotEmpty()
  scheduleId: string;

  /**
   * 예약 인원
   * @example 2
   */
  @IsNumber()
  @Min(1)
  headCount: number;
}

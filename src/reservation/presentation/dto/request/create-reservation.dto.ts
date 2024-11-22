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

  // TODO 사용자 정보를 데코레이터로 갖고 올 수 있도록 합니다.
  /**
   * 사용자 ID
   * @example "user-1"
   */
  @IsString()
  userId: string;
}

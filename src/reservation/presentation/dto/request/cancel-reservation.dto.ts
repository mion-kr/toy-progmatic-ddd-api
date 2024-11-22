import { IsString } from 'class-validator';

export class CancelReservationDto {
  /**
   * 사용자 ID
   * @example "user-1"
   */
  @IsString()
  userId: string;
}

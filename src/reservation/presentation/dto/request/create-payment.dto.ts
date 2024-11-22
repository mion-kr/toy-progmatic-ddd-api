import { IsNumber, IsString, Min } from 'class-validator';

export class CreatePaymentDto {
  /**
   * 결제 금액
   */
  @IsNumber()
  @Min(1000)
  price: number;

  // TODO 사용자 정보를 데코레이터로 갖고 올 수 있도록 합니다.
  /**
   * 사용자 ID
   * @example "user-1"
   */
  @IsString()
  userId: string;
}

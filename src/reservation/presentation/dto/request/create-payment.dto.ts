import { IsNumber, Min } from 'class-validator';

export class CreatePaymentDto {
  /**
   * 결제 금액
   */
  @IsNumber()
  @Min(1000)
  price: number;
}

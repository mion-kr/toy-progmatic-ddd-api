import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePartnersDto {
  /**
   * 상호명
   * @example "낚시배 주식회사"
   */
  @IsString()
  @IsNotEmpty()
  name: string;

  /**
   * 사업자등록번호
   * @example "1234567890"
   */
  @IsString()
  @IsNotEmpty()
  businessNumber: string;
}

import { IsString } from 'class-validator';

export class LoginUserDto {
  /**
   * SNS ID
   * @example "1234567890"
   */
  @IsString()
  snsId: string;

  /**
   * 비밀번호
   * @example "abc123"
   */
  @IsString()
  password: string;
}

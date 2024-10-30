import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class CreateUserDto {
  /**
   * SNS ID
   * @example 1234567890
   */
  @IsString()
  @IsNotEmpty()
  snsId: string;

  /**
   * 비밀번호
   * @example abc123
   */
  @IsStrongPassword({ minLength: 6, minSymbols: 0, minUppercase: 0 })
  password: string;

  /**
   * 이메일
   * @example example@example.com
   */
  @IsEmail()
  email: string;

  /**
   * 닉네임
   * @example example
   */
  @IsString()
  @IsNotEmpty()
  nickName: string;

  /**
   * 프로필 이미지
   * @example https://example.com/image.png
   */
  @IsString()
  @IsOptional()
  profileImage: string;
}

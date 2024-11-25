import { RoleType } from '@prisma/client';
import { IsBoolean, IsEnum, IsOptional } from 'class-validator';

export class UpdateRoleUserDto {
  /**
   * 권한
   * @example 'USER'
   */
  @IsEnum(RoleType, { each: true })
  role: RoleType;

  /**
   * 삭제 여부
   * @example false
   */
  @IsBoolean()
  @IsOptional()
  isDeleted?: boolean;
}

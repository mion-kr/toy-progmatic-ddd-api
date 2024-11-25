import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsOptional,
  ValidateNested
} from 'class-validator';
import { CreateUserDto } from './create.user.dto';
import { UpdateRoleUserDto } from './update-role.user.dto';

export class UpdateUserDto extends PartialType(
  PickType(CreateUserDto, ['email', 'nickName', 'profileImage'] as const),
) {
  @ApiProperty({
    description: '권한',
    type: [UpdateRoleUserDto],
  })
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => UpdateRoleUserDto)
  roles: UpdateRoleUserDto[];
}

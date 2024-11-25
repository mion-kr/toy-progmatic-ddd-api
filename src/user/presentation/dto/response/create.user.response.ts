import { ApiProperty, PickType } from '@nestjs/swagger';
import { RoleType } from '@prisma/client';
import { UserEntity } from '../../../domain/user.entity';
import { CreateUserDto } from '../request/create.user.dto';

export class CreateUserResponse extends PickType(CreateUserDto, [
  'snsId',
  'email',
  'nickName',
  'profileImage',
] as const) {
  constructor(partial: UserEntity) {
    super();
    this.snsId = partial.snsId;
    this.email = partial.email;
    this.nickName = partial.nickName;
    this.profileImage = partial.profileImage;
    this.roles = partial.roles;
  }

  @ApiProperty({
    example: [RoleType.USER],
    description: '유저 권한',
    required: true,
  })
  roles: RoleType[];
}

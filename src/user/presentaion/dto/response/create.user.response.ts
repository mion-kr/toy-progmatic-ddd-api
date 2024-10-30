import { PickType } from '@nestjs/swagger';
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
  }
}

import { PickType } from '@nestjs/swagger';
import { UserEntity } from '../../../domain/user.entity';
import { CreateUserDto } from '../request/create.user.dto';

export class DeleteUserResponse extends PickType(CreateUserDto, [
  'snsId',
] as const) {
  constructor(partial: UserEntity) {
    super();
    this.snsId = partial.snsId;
  }
}

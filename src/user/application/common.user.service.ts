import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserEntity } from '../domain/user.entity';

@Injectable()
export class CommonUserService {
  async validateNotFoundUser(user: UserEntity) {
    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }
  }

  async validateConflictSnsId(user: UserEntity) {
    if (user) {
      throw new ConflictException('이미 존재하는 사용자');
    }
  }

  async validateConflictEmail(user: UserEntity, ignoreEmail?: string) {
    if (user && user.email !== ignoreEmail) {
      throw new ConflictException('이미 존재하는 이메일');
    }
  }
}

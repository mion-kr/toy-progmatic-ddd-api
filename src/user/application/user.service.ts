import { Injectable } from '@nestjs/common';
import { UserEntity } from '../domain/user.entity';
import { UserRepository } from '../infrastructure/user.repository';
import { CreateUserDto } from '../presentation/dto/request/create.user.dto';
import { UpdateUserDto } from '../presentation/dto/request/update.user.dto';
import { CommonUserService } from './common.user.service';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly commonUserService: CommonUserService,
  ) {}

  /**
   * 사용자 생성
   */
  async create(dto: CreateUserDto) {
    const saved_user = await this.userRepository.findBySnsId(dto.snsId);

    await this.commonUserService.validateConflictSnsId(saved_user);
    await this.commonUserService.validateConflictEmail(saved_user);

    const user = UserEntity.create({ ...dto, createdBy: dto.snsId });

    const createdUser = await this.userRepository.create(user);

    return createdUser;
  }

  /**
   * 사용자 조회
   */
  async findBySnsId(snsId: string) {
    const user = await this.userRepository.findBySnsId(snsId);

    await this.commonUserService.validateNotFoundUser(user);

    return user;
  }

  /**
   * 사용자 수정
   */
  async update(snsId: string, dto: UpdateUserDto) {
    const user = await this.userRepository.findBySnsId(snsId);

    await this.commonUserService.validateNotFoundUser(user);
    if (dto.email) {
      await this.commonUserService.validateConflictEmail(user, dto.email);
    }

    await user.update({ ...dto, updatedBy: snsId });

    const updatedUser = await this.userRepository.update(user);

    return updatedUser;
  }

  /**
   * 사용자 삭제
   */
  async delete(snsId: string) {
    const user = await this.userRepository.findBySnsId(snsId);

    await this.commonUserService.validateNotFoundUser(user);

    await user.delete({ deletedBy: snsId });

    return await this.userRepository.update(user);
  }
}

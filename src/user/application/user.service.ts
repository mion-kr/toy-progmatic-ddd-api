import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../shared/prisma/prisma.service';
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

    private readonly prismaService: PrismaService,
  ) {}

  /**
   * 사용자 생성
   */
  async create(dto: CreateUserDto) {
    return await this.prismaService.$transaction(async (tx) => {
      const saved_user = await this.userRepository.findBySnsId(dto.snsId, tx);

      await this.commonUserService.validateConflictSnsId(saved_user);
      await this.commonUserService.validateConflictEmail(saved_user);

      const user = UserEntity.createNew({ ...dto, createdBy: dto.snsId });

      const createdUser = await this.userRepository.create(user, tx);

      return createdUser;
    });
  }

  /**
   * 사용자 조회
   */
  async findBySnsId(snsId: string, tx?: Prisma.TransactionClient) {
    const fn = async (tx: Prisma.TransactionClient) => {
      const user = await this.userRepository.findBySnsId(snsId, tx);

      await this.commonUserService.validateNotFoundUser(user);

      return user;
    };

    return tx ? fn(tx) : await this.prismaService.$transaction(fn);
  }

  /**
   * 사용자 수정
   */
  async update(snsId: string, dto: UpdateUserDto) {
    return await this.prismaService.$transaction(async (tx) => {
      const user = await this.userRepository.findBySnsId(snsId);

      await this.commonUserService.validateNotFoundUser(user);
      if (dto.email) {
        await this.commonUserService.validateConflictEmail(user, dto.email);
      }

      await user.update({ ...dto, updatedBy: snsId });

      const updatedUser = await this.userRepository.update(user, tx);

      return updatedUser;
    });
  }

  /**
   * 사용자 삭제
   */
  async delete(snsId: string) {
    return await this.prismaService.$transaction(async (tx) => {
      const user = await this.userRepository.findBySnsId(snsId, tx);

      await this.commonUserService.validateNotFoundUser(user);

      await user.delete(snsId);

      return await this.userRepository.update(user, tx);
    });
  }
}

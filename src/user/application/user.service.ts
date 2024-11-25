import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { UserEntity } from '../domain/user.entity';
import { UserRepository } from '../infrastructure/user.repository';
import { CreateUserDto } from '../presentation/dto/request/create.user.dto';
import { UpdateUserDto } from '../presentation/dto/request/update.user.dto';
import { CommonUserService } from './common.user.service';
import { UserRoleService } from './user-role.service';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly commonUserService: CommonUserService,

    private readonly userRoleService: UserRoleService,

    private readonly prismaService: PrismaService,
  ) {}

  /**
   * 사용자 생성
   */
  async create(dto: CreateUserDto) {
    return await this.prismaService.$transaction(async (tx) => {
      const savedUserBySnsId = await this.userRepository.findOneBySnsId(
        dto.snsId,
        tx,
      );

      await this.commonUserService.validateConflictSnsId(savedUserBySnsId);

      const savedUserByEmail = await this.userRepository.findByEmail(
        dto.email,
        tx,
      );
      await this.commonUserService.validateConflictEmail(savedUserByEmail);

      const user = await UserEntity.createNew({ ...dto, createdBy: dto.snsId });

      await this.userRepository.create(user, tx);

      return await this.userRepository.findOneBySnsId(dto.snsId, tx);
    });
  }

  /**
   * 사용자 조회
   */
  async findOneBySnsId(snsId: string, tx?: Prisma.TransactionClient) {
    const fn = async (tx: Prisma.TransactionClient) => {
      const user = await this.userRepository.findOneBySnsId(snsId, tx);

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
      const user = await this.userRepository.findOneBySnsId(snsId);

      await this.commonUserService.validateNotFoundUser(user);
      if (dto.email) {
        await this.commonUserService.validateConflictEmail(user, dto.email);
      }

      await user.update({ ...dto, updatedBy: snsId });

      await this.userRepository.update(user, tx);

      if (dto.roles?.length > 0) {
        await this.userRoleService.updateUserRoles(snsId, dto.roles, tx);
      }

      return await this.userRepository.findOneBySnsId(snsId, tx);
    });
  }

  /**
   * 사용자 삭제
   */
  async delete(snsId: string) {
    return await this.prismaService.$transaction(async (tx) => {
      const user = await this.userRepository.findOneBySnsId(snsId, tx);

      await this.commonUserService.validateNotFoundUser(user);

      await user.delete(snsId);

      return;
    });
  }
}

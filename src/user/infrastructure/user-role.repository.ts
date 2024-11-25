import { Injectable } from '@nestjs/common';
import { Prisma, RoleType } from '@prisma/client';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { UserRoleEntity } from '../domain/user-role.entity';
import { IUserRoleRepository } from '../domain/user-role.repository.interface';

@Injectable()
export class UserRoleRepository implements IUserRoleRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findAllByUserId(
    userId: string,
    tx?: Prisma.TransactionClient,
  ): Promise<UserRoleEntity[]> {
    const prisma = tx ?? this.prismaService;

    const userRoles = await prisma.userRole.findMany({
      where: { userId },
    });

    return userRoles.map(UserRoleEntity.fromPersistence);
  }
  async createMany(
    userRoles: UserRoleEntity[],
    tx?: Prisma.TransactionClient,
  ): Promise<void> {
    const prisma = tx ?? this.prismaService;

    const data = userRoles.map((role) => ({
      userId: role.userId,
      roleId: role.roleId,
    }));

    await prisma.userRole.createMany({
      data,
    });
  }
  async update(
    userRole: UserRoleEntity,
    tx?: Prisma.TransactionClient,
  ): Promise<void> {
    const prisma = tx ?? this.prismaService;

    await prisma.userRole.update({
      where: {
        userId_roleId: {
          userId: userRole.userId,
          roleId: userRole.roleId,
        },
      },
      data: {
        roleId: userRole.roleId,
      },
    });
  }

  async deleteByUserIdAndRoleId(
    userId: string,
    roleId: RoleType,
    tx?: Prisma.TransactionClient,
  ): Promise<void> {
    const prisma = tx ?? this.prismaService;

    await prisma.userRole.delete({
      where: { userId_roleId: { userId, roleId } },
    });
  }

  /**
   * 유저 권한 삭제(물리)
   * @param userId
   * @param tx
   */
  async deleteManyByUserId(userId: string, tx?: Prisma.TransactionClient) {
    const prisma = tx ?? this.prismaService;

    await prisma.userRole.deleteMany({ where: { userId } });
  }
}

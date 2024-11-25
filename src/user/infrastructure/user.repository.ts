import { Injectable } from '@nestjs/common';
import { Prisma, RoleType } from '@prisma/client';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { UserEntity } from '../domain/user.entity';
import { IUserRepository } from '../domain/user.repository.interface';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findOneBySnsId(
    snsId: string,
    tx?: Prisma.TransactionClient,
  ): Promise<UserEntity | null> {
    const prisma = tx ?? this.prismaService;

    const user = await prisma.user.findUnique({
      where: { snsId, deletedAt: null },
      include: {
        roles: true,
      },
    });
    return user ? UserEntity.fromPersistence(user) : null;
  }

  async findByEmail(
    email: string,
    tx?: Prisma.TransactionClient,
  ): Promise<UserEntity | null> {
    const prisma = tx ?? this.prismaService;

    const user = await prisma.user.findUnique({
      where: { email, deletedAt: null },
    });
    return user ? UserEntity.fromPersistence(user) : null;
  }

  async create(user: UserEntity, tx?: Prisma.TransactionClient): Promise<void> {
    const prisma = tx ?? this.prismaService;

    await prisma.user.create({
      data: {
        snsId: user.snsId,
        password: user.password,
        email: user.email,
        nickName: user.nickName,
        profileImage: user.profileImage,
        createdBy: user.createdBy,
        createdAt: user.createdAt,
        updatedBy: user.updatedBy,
        updatedAt: user.updatedAt,
        roles: {
          create: {
            roleId: RoleType.USER,
          },
        },
      },
    });
  }

  async update(user: UserEntity, tx?: Prisma.TransactionClient): Promise<void> {
    const prisma = tx ?? this.prismaService;

    await prisma.user.update({
      where: { snsId: user.snsId },
      data: {
        email: user?.email,
        nickName: user?.nickName,
        profileImage: user?.profileImage,
        updatedBy: user?.updatedBy,
        updatedAt: user?.updatedAt,
        deletedBy: user?.deletedBy,
        deletedAt: user?.deletedAt,
      },
    });
  }
}

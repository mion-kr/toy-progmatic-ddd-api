import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { UserEntity } from '../domain/user.entity';
import { IUserRepository } from '../domain/user.repository.interface';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findBySnsId(snsId: string): Promise<UserEntity | null> {
    const user = await this.prismaService.user.findUnique({
      where: { snsId, deletedAt: null },
    });
    return user ? UserEntity.create(user) : null;
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.prismaService.user.findUnique({
      where: { email, deletedAt: null },
    });
    return user ? UserEntity.create(user) : null;
  }

  async create(user: UserEntity): Promise<UserEntity> {
    const createdUser = await this.prismaService.user.create({
      data: {
        snsId: user.snsId,
        password: user.password,
        email: user.email,
        nickName: user.nickName,
        profileImage: user.profileImage,
        createdBy: user.createdBy,
        createdAt: user.createdAt,
      },
    });
    return UserEntity.create(createdUser);
  }

  async update(user: UserEntity): Promise<UserEntity> {
    const updatedUser = await this.prismaService.user.update({
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
    return UserEntity.create(updatedUser);
  }
}

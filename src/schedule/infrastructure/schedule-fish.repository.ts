import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { ScheduleFishEntity } from '../domain/schedule-fish.entity';
import { IScheduleFishRepository } from '../domain/schedule-fish.repository.interface';

@Injectable()
export class ScheduleFishRepository implements IScheduleFishRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findAllByScheduleId(
    scheduleId: string,
    tx?: Prisma.TransactionClient,
  ): Promise<ScheduleFishEntity[]> {
    const prisma = tx ?? this.prismaService;

    const scheduleFishes = await prisma.scheduleFish.findMany({
      where: {
        scheduleId,
        deletedAt: null,
      },
    });

    return scheduleFishes.map(ScheduleFishEntity.fromPersistence);
  }

  async findById(
    id: string,
    tx?: Prisma.TransactionClient,
  ): Promise<ScheduleFishEntity | null> {
    const prisma = tx ?? this.prismaService;

    const scheduleFish = await prisma.scheduleFish.findUnique({
      where: { id, deletedAt: null },
    });
    return scheduleFish
      ? ScheduleFishEntity.fromPersistence(scheduleFish)
      : null;
  }

  async createMany(
    scheduleFishes: ScheduleFishEntity[],
    tx?: Prisma.TransactionClient,
  ): Promise<ScheduleFishEntity[]> {
    const prisma = tx ?? this.prismaService;

    await prisma.scheduleFish.createMany({
      data: scheduleFishes.map((fish) => ({
        fishId: fish.fishId,
        scheduleId: fish.scheduleId,
        createdBy: fish.createdBy,
        createdAt: fish.createdAt,
        updatedBy: fish.updatedBy,
        updatedAt: fish.updatedAt,
      })),
    });

    const createdScheduleFishes = await prisma.scheduleFish.findMany({
      where: {
        id: { in: scheduleFishes.map((fish) => fish.id) },
      },
    });

    return createdScheduleFishes.map(ScheduleFishEntity.fromPersistence);
  }

  async update(
    scheduleFish: ScheduleFishEntity,
    tx?: Prisma.TransactionClient,
  ): Promise<ScheduleFishEntity> {
    const prisma = tx ?? this.prismaService;

    const updatedScheduleFish = await prisma.scheduleFish.update({
      where: { id: scheduleFish.id },
      data: {
        fishId: scheduleFish.fishId,
        updatedBy: scheduleFish.updatedBy,
        updatedAt: scheduleFish.updatedAt,
        deletedBy: scheduleFish.deletedBy,
        deletedAt: scheduleFish.deletedAt,
      },
    });
    return ScheduleFishEntity.fromPersistence(updatedScheduleFish);
  }

  async deleteManyByScheduleId(
    scheduleId: string,
    deletedBy: string,
    tx?: Prisma.TransactionClient,
  ) {
    const prisma = tx ?? this.prismaService;

    await prisma.scheduleFish.updateMany({
      where: { scheduleId },
      data: { deletedBy: deletedBy, deletedAt: new Date() },
    });
  }
}

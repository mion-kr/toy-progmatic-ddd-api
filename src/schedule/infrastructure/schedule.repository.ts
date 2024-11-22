import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { ScheduleEntity } from '../domain/schedule.entity';
import { IScheduleRepository } from '../domain/schedule.repository.interface';

@Injectable()
export class ScheduleRepository implements IScheduleRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(dto: {
    page: number;
    limit: number;
  }): Promise<{ datas: ScheduleEntity[]; count: number }> {
    const where = { deletedAt: null };

    const schedules = await this.prismaService.schedule.findMany({
      where,
      skip: (dto.page - 1) * dto.limit,
      take: dto.limit,
      include: {
        fishes: {
          where: { deletedAt: null },
        },
      },
    });

    const totalCount = await this.prismaService.schedule.count({
      where,
    });

    return {
      datas: schedules.map((schedule) =>
        ScheduleEntity.fromPersistence(schedule),
      ),
      count: totalCount,
    };
  }

  async findById(
    id: string,
    tx?: Prisma.TransactionClient,
  ): Promise<ScheduleEntity | null> {
    const prisma = tx ?? this.prismaService;

    const schedule = await prisma.schedule.findUnique({
      where: { id, deletedAt: null },
      include: {
        fishes: {
          where: { deletedAt: null },
        },
      },
    });
    return schedule ? ScheduleEntity.fromPersistence(schedule) : null;
  }

  async findByProductId(
    productId: string,
    tx?: Prisma.TransactionClient,
  ): Promise<ScheduleEntity[]> {
    const prisma = tx ?? this.prismaService;

    const schedules = await prisma.schedule.findMany({
      where: { productId, deletedAt: null },
      include: {
        fishes: {
          where: { deletedAt: null },
        },
      },
    });
    return schedules.map((schedule) =>
      ScheduleEntity.fromPersistence(schedule),
    );
  }

  async create(
    schedule: ScheduleEntity,
    tx?: Prisma.TransactionClient,
  ): Promise<ScheduleEntity> {
    const prisma = tx ?? this.prismaService;

    const createdSchedule = await prisma.schedule.create({
      data: {
        productId: schedule.productId,
        fishingDate: schedule.fishingDate,
        name: schedule.name,
        price: schedule.price,
        description: schedule.description,
        operationTime: schedule.operationTime,
        allocationTime: schedule.allocationTime,
        headCount: schedule.headCount,
        minHeadCount: schedule.minHeadCount,
        status: schedule.status,
        createdBy: schedule.createdBy,
        createdAt: schedule.createdAt,
        updatedBy: schedule.updatedBy,
        updatedAt: schedule.updatedAt,
      },
      include: {
        fishes: {
          where: { deletedAt: null },
        },
      },
    });
    return ScheduleEntity.fromPersistence(createdSchedule);
  }

  async update(
    schedule: ScheduleEntity,
    tx?: Prisma.TransactionClient,
  ): Promise<ScheduleEntity> {
    const prisma = tx ?? this.prismaService;

    const updatedSchedule = await prisma.schedule.update({
      where: { id: schedule.id },
      data: {
        productId: schedule.productId,
        fishingDate: schedule.fishingDate,
        name: schedule.name,
        price: schedule.price,
        description: schedule.description,
        operationTime: schedule.operationTime,
        allocationTime: schedule.allocationTime,
        headCount: schedule.headCount,
        minHeadCount: schedule.minHeadCount,
        status: schedule.status,
        updatedBy: schedule.updatedBy,
        updatedAt: schedule.updatedAt,
        deletedBy: schedule.deletedBy,
        deletedAt: schedule.deletedAt,
      },
      include: {
        fishes: {
          where: { deletedAt: null },
        },
      },
    });

    return ScheduleEntity.fromPersistence(updatedSchedule);
  }
}

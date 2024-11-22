import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { ReservationEntity } from '../domain/reservation.entity';
import { IReservationRepository } from '../domain/reservation.repository.interface';

@Injectable()
export class ReservationRepository implements IReservationRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(dto: {
    page: number;
    limit: number;
  }): Promise<{ datas: ReservationEntity[]; count: number }> {
    const prisma = this.prismaService;

    const where = { deletedAt: null };

    const reservations = await prisma.reservation.findMany({
      where,
      skip: (dto.page - 1) * dto.limit,
      take: dto.limit,
      include: {
        schedule: true,
        user: true,
      },
    });

    const totalCount = await prisma.reservation.count({
      where,
    });

    return {
      datas: reservations.map((reservation) =>
        ReservationEntity.fromPersistence(reservation),
      ),
      count: totalCount,
    };
  }

  async findById(
    id: string,
    tx?: Prisma.TransactionClient,
  ): Promise<ReservationEntity | null> {
    const prisma = tx ?? this.prismaService;

    const reservation = await prisma.reservation.findUnique({
      where: { id, deletedAt: null },
      include: {
        schedule: true,
        payment: true,
      },
    });

    return reservation ? ReservationEntity.fromPersistence(reservation) : null;
  }

  async create(
    reservation: ReservationEntity,
    tx?: Prisma.TransactionClient,
  ): Promise<ReservationEntity> {
    const prisma = tx ?? this.prismaService;

    const createdReservation = await prisma.reservation.create({
      data: {
        id: reservation.id,
        scheduleId: reservation.scheduleId,
        headCount: reservation.headCount,
        userId: reservation.userId,
        status: reservation.status,
        createdBy: reservation.createdBy,
        createdAt: reservation.createdAt,
        updatedBy: reservation.updatedBy,
        updatedAt: reservation.updatedAt,
      },
    });

    return ReservationEntity.fromPersistence(createdReservation);
  }

  async update(
    reservation: ReservationEntity,
    tx?: Prisma.TransactionClient,
  ): Promise<ReservationEntity> {
    const prisma = tx ?? this.prismaService;

    const updatedReservation = await prisma.reservation.update({
      where: { id: reservation.id },
      data: {
        headCount: reservation.headCount,
        status: reservation.status,
        updatedBy: reservation.updatedBy,
        updatedAt: reservation.updatedAt,
        deletedAt: reservation.deletedAt,
        deletedBy: reservation.deletedBy,
      },
    });

    return ReservationEntity.fromPersistence(updatedReservation);
  }
}

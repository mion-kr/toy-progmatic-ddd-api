import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { PartnersEntity } from '../domain/partners.entity';
import { IPartnersRepository } from '../domain/partners.repository.interface';

@Injectable()
export class PartnersRepository implements IPartnersRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(
    dto: {
      page: number;
      limit: number;
    },
    tx?: Prisma.TransactionClient,
  ): Promise<{ datas: PartnersEntity[]; count: number }> {
    const prisma = tx ?? this.prismaService;

    const where = { deletedAt: null };

    const partners = await prisma.partners.findMany({
      where,
      skip: (dto.page - 1) * dto.limit,
      take: dto.limit,
    });

    const totalCount = await prisma.partners.count({
      where,
    });

    return {
      datas: partners.map((partner) => PartnersEntity.fromPersistence(partner)),
      count: totalCount,
    };
  }

  async findById(
    id: string,
    tx?: Prisma.TransactionClient,
  ): Promise<PartnersEntity | null> {
    const prisma = tx ?? this.prismaService;

    const partners = await prisma.partners.findUnique({
      where: { id, deletedAt: null },
    });
    return partners ? PartnersEntity.fromPersistence(partners) : null;
  }

  async findByBusinessNumber(
    businessNumber: string,
    tx?: Prisma.TransactionClient,
  ): Promise<PartnersEntity | null> {
    const prisma = tx ?? this.prismaService;

    const partners = await prisma.partners.findUnique({
      where: { businessNumber, deletedAt: null },
    });
    return partners ? PartnersEntity.fromPersistence(partners) : null;
  }

  async create(
    partners: PartnersEntity,
    tx?: Prisma.TransactionClient,
  ): Promise<PartnersEntity> {
    const prisma = tx ?? this.prismaService;

    const createdPartners = await prisma.partners.create({
      data: {
        name: partners.name,
        businessNumber: partners.businessNumber,
        createdBy: partners.createdBy,
        createdAt: partners.createdAt,
        updatedBy: partners.updatedBy,
        updatedAt: partners.updatedAt,
      },
    });
    return PartnersEntity.fromPersistence(createdPartners);
  }

  async update(
    partners: PartnersEntity,
    tx?: Prisma.TransactionClient,
  ): Promise<PartnersEntity> {
    const prisma = tx ?? this.prismaService;

    const updatedPartners = await prisma.partners.update({
      where: { id: partners.id },
      data: {
        name: partners.name,
        businessNumber: partners.businessNumber,
        updatedBy: partners.updatedBy,
        updatedAt: partners.updatedAt,
        deletedBy: partners.deletedBy,
        deletedAt: partners.deletedAt,
      },
    });
    return PartnersEntity.fromPersistence(updatedPartners);
  }
}

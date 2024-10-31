import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { PartnersEntity } from '../domain/partners.entity';
import { IPartnersRepository } from '../domain/partners.repository.interface';

@Injectable()
export class PartnersRepository implements IPartnersRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(dto: {
    page: number;
    limit: number;
  }): Promise<{ datas: PartnersEntity[]; count: number }> {
    const where = { deletedAt: null };

    const partners = await this.prismaService.partners.findMany({
      where,
      skip: (dto.page - 1) * dto.limit,
      take: dto.limit,
    });

    const totalCount = await this.prismaService.partners.count({
      where,
    });

    return {
      datas: partners.map((partner) => PartnersEntity.create(partner)),
      count: totalCount,
    };
  }

  async findById(id: string): Promise<PartnersEntity | null> {
    const partners = await this.prismaService.partners.findUnique({
      where: { id, deletedAt: null },
    });
    return partners ? PartnersEntity.create(partners) : null;
  }

  async findByBusinessNumber(
    businessNumber: string,
  ): Promise<PartnersEntity | null> {
    const partners = await this.prismaService.partners.findUnique({
      where: { businessNumber, deletedAt: null },
    });
    return partners ? PartnersEntity.create(partners) : null;
  }

  async create(partners: PartnersEntity): Promise<PartnersEntity> {
    const createdPartners = await this.prismaService.partners.create({
      data: {
        name: partners.name,
        businessNumber: partners.businessNumber,
        createdBy: partners.createdBy,
        createdAt: partners.createdAt,
      },
    });
    return PartnersEntity.create(createdPartners);
  }

  async update(partners: PartnersEntity): Promise<PartnersEntity> {
    const updatedPartners = await this.prismaService.partners.update({
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
    return PartnersEntity.create(updatedPartners);
  }
}

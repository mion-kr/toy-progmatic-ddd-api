import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { ProductEntity } from '../domain/product.entity';
import { IProductRepository } from '../domain/product.repository.interface';

@Injectable()
export class ProductRepository implements IProductRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(dto: {
    page: number;
    limit: number;
  }): Promise<{ datas: ProductEntity[]; count: number }> {
    const where = { deletedAt: null };

    const products = await this.prismaService.product.findMany({
      where,
      skip: (dto.page - 1) * dto.limit,
      take: dto.limit,
      include: {
        productFishes: {
          where: { deletedAt: null },
        },
      },
    });

    const totalCount = await this.prismaService.product.count({
      where,
    });

    return {
      datas: products.map((product) => ProductEntity.fromPersistence(product)),
      count: totalCount,
    };
  }

  async findById(
    id: string,
    tx?: Prisma.TransactionClient,
  ): Promise<ProductEntity | null> {
    const prisma = tx ?? this.prismaService;

    const product = await prisma.product.findUnique({
      where: { id, deletedAt: null },
      include: {
        productFishes: {
          where: { deletedAt: null },
        },
      },
    });
    return product ? ProductEntity.fromPersistence(product) : null;
  }

  async findByPartnersId(partnersId: string): Promise<ProductEntity[]> {
    const products = await this.prismaService.product.findMany({
      where: { partnersId, deletedAt: null },
      include: {
        partners: true,
      },
    });
    return products.map((product) => ProductEntity.fromPersistence(product));
  }

  async create(
    product: ProductEntity,
    tx?: Prisma.TransactionClient,
  ): Promise<ProductEntity> {
    const prisma = tx ?? this.prismaService;

    const createdProduct = await prisma.product.create({
      data: {
        name: product.name,
        price: product.price,
        description: product.description,
        operationTime: product.operationTime,
        headCount: product.headCount,
        minHeadCount: product.minHeadCount,
        displayStatus: product.displayStatus,
        partnersId: product.partnersId,
        createdBy: product.createdBy,
        createdAt: product.createdAt,
        updatedBy: product.updatedBy,
        updatedAt: product.updatedAt,
      },
    });
    return ProductEntity.fromPersistence(createdProduct);
  }

  async update(
    product: ProductEntity,
    tx?: Prisma.TransactionClient,
  ): Promise<ProductEntity> {
    const prisma = tx ?? this.prismaService;

    const updatedProduct = await prisma.product.update({
      where: { id: product.id },
      data: {
        name: product.name,
        price: product.price,
        description: product.description,
        operationTime: product.operationTime,
        headCount: product.headCount,
        minHeadCount: product.minHeadCount,
        displayStatus: product.displayStatus,
        updatedBy: product.updatedBy,
        updatedAt: product.updatedAt,
      },
    });

    return ProductEntity.fromPersistence(updatedProduct);
  }
}

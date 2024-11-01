import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { ProductFishEntity } from '../domain/product-fish.entity';
import { IProductFishRepository } from '../domain/product-fish.repository.interface';

@Injectable()
export class ProductFishRepository implements IProductFishRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findAllByProductId(
    productId: string,
    tx?: Prisma.TransactionClient,
  ): Promise<ProductFishEntity[]> {
    const prisma = tx ?? this.prismaService;

    const productFishes = await prisma.productFish.findMany({
      where: {
        productId,
        deletedAt: null,
      },
    });

    return productFishes.map(ProductFishEntity.fromPersistence);
  }

  async findById(
    id: string,
    tx?: Prisma.TransactionClient,
  ): Promise<ProductFishEntity | null> {
    const prisma = tx ?? this.prismaService;

    const productFish = await prisma.productFish.findUnique({
      where: { id, deletedAt: null },
    });
    return productFish ? ProductFishEntity.fromPersistence(productFish) : null;
  }

  async createMany(
    productFishes: ProductFishEntity[],
    tx?: Prisma.TransactionClient,
  ): Promise<ProductFishEntity[]> {
    const prisma = tx ?? this.prismaService;

    await prisma.productFish.createMany({
      data: productFishes.map((fish) => ({
        fishId: fish.fishId,
        productId: fish.productId,
        createdBy: fish.createdBy,
        createdAt: fish.createdAt,
        updatedBy: fish.updatedBy,
        updatedAt: fish.updatedAt,
      })),
    });

    const createdProductFishes = await prisma.productFish.findMany({
      where: {
        id: { in: productFishes.map((fish) => fish.id) },
      },
    });

    return createdProductFishes.map(ProductFishEntity.fromPersistence);
  }

  async update(
    productFish: ProductFishEntity,
    tx?: Prisma.TransactionClient,
  ): Promise<ProductFishEntity> {
    const prisma = tx ?? this.prismaService;

    const updatedProductFish = await prisma.productFish.update({
      where: { id: productFish.id },
      data: {
        fishId: productFish.fishId,
        updatedBy: productFish.updatedBy,
        updatedAt: productFish.updatedAt,
        deletedBy: productFish.deletedBy,
        deletedAt: productFish.deletedAt,
      },
    });
    return ProductFishEntity.fromPersistence(updatedProductFish);
  }

  async deleteManyByProductId(
    productId: string,
    deletedBy: string,
    tx?: Prisma.TransactionClient,
  ) {
    const prisma = tx ?? this.prismaService;

    await prisma.productFish.updateMany({
      where: { productId },
      data: { deletedBy: deletedBy, deletedAt: new Date() },
    });
  }
}

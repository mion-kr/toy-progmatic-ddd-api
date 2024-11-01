import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ProductFishEntity } from '../domain/product-fish.entity';
import { ProductFishRepository } from '../infrastructure/product-fish.repository';
import { UpdateProductFishDto } from '../presentation/dto/request/update-product-fish.dto';

@Injectable()
export class ProductFishService {
  constructor(private readonly productFishRepository: ProductFishRepository) {}

  async findAllByProductId(
    id: string,
    tx?: Prisma.TransactionClient,
  ): Promise<ProductFishEntity[]> {
    return this.productFishRepository.findAllByProductId(id, tx);
  }

  async updateProductFishes(
    productId: string,
    dto: UpdateProductFishDto[],
    updatedBy: string,
    tx?: Prisma.TransactionClient,
  ) {
    const productFishes = await this.productFishRepository.findAllByProductId(
      productId,
      tx,
    );

    await this.handleDeletedFishes(productFishes, dto, updatedBy, tx);

    await this.handleCreatedFishes(dto, productId, updatedBy, tx);

    await this.handleUpdatedFishes(productFishes, dto, updatedBy, tx);
  }

  /**
   * 상품에서 생성된 어종 처리
   * @param dto
   * @param productId
   * @param updatedBy
   * @param tx
   */
  private async handleCreatedFishes(
    dto: UpdateProductFishDto[],
    productId: string,
    updatedBy: string,
    tx?: Prisma.TransactionClient,
  ) {
    const productFishesToCreate = dto
      .filter((dto) => !dto.id)
      .map((dto) =>
        ProductFishEntity.createNew({
          productId: productId,
          fishId: dto.fishId,
          createdBy: updatedBy,
        }),
      );

    await this.productFishRepository.createMany(productFishesToCreate, tx);
  }

  /**
   * 상품에서 수정된 어종 처리
   * @param productFishes
   * @param dto
   * @param updatedBy
   * @returns
   */
  private async handleUpdatedFishes(
    productFishes: ProductFishEntity[],
    dto: UpdateProductFishDto[],
    updatedBy: string,
    tx?: Prisma.TransactionClient,
  ) {
    const productFishesToUpdate = productFishes
      .filter((fish) => dto.some((dto) => dto.id === fish.id))
      .map((savedFish) => {
        savedFish.update({
          ...dto.find((dto) => dto.id === savedFish.id),
          updatedBy,
        });
        return savedFish;
      });

    for (const productFishToUpdate of productFishesToUpdate) {
      await this.productFishRepository.update(productFishToUpdate, tx);
    }
  }

  /**
   * 상품에서 삭제된 어종 처리
   * @param productFishes
   * @param dto
   * @param updatedBy
   */
  private async handleDeletedFishes(
    productFishes: ProductFishEntity[],
    dto: UpdateProductFishDto[],
    updatedBy: string,
    tx?: Prisma.TransactionClient,
  ) {
    const productFishesToDelete = productFishes
      .filter((fish) =>
        dto.some((dto) => dto.id === fish.id && dto.isDeleted === true),
      )
      .map((fish) => {
        fish.delete(updatedBy);
        return fish;
      });

    for (const productFishToDelete of productFishesToDelete) {
      await this.productFishRepository.update(productFishToDelete, tx);
    }
  }

  async deleteManyByProductId(
    productId: string,
    deletedBy: string,
    tx?: Prisma.TransactionClient,
  ) {
    await this.productFishRepository.deleteManyByProductId(
      productId,
      deletedBy,
      tx,
    );
  }
}

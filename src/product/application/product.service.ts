import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { CommonUserService } from '../../user/application/common.user.service';
import { UserService } from '../../user/application/user.service';
import { ProductEntity } from '../domain/product.entity';
import { ProductRepository } from '../infrastructure/product.repository';
import { CreateProductDto } from '../presentation/dto/request/create.product.dto';
import { FindAllProductDto } from '../presentation/dto/request/find-all.product.dto';
import { UpdateProductDto } from '../presentation/dto/request/update.product.dto';
import { CommonProductService } from './common.product.service';
import { ProductFishService } from './product-fish.service';

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly commonProductService: CommonProductService,

    private readonly productFishService: ProductFishService,

    private readonly userService: UserService,
    private readonly commonUserService: CommonUserService,

    private readonly prismaService: PrismaService,
  ) {}

  /**
   * 상품 생성
   */
  async create(dto: CreateProductDto, createdBy: string) {
    const createdProduct = await this.prismaService.$transaction(async (tx) => {
      const user = await this.userService.findOneBySnsId(dto.userId, tx);

      await this.commonUserService.validateNotFoundUser(user);

      const product = ProductEntity.createNew({
        ...dto,
        createdBy,
      });

      const createdProduct = await this.productRepository.create(product, tx);

      if (dto.fishes.length > 0) {
        await this.productFishService.updateProductFishes(
          createdProduct.id,
          dto.fishes,
          createdBy,
          tx,
        );
      }

      return await this.productRepository.findById(createdProduct.id, tx);
    });

    return createdProduct;
  }

  /**
   * 상품 목록 조회
   */
  async findAll(dto: FindAllProductDto) {
    const { datas, count } = await this.productRepository.findAll(dto);

    return { datas, count };
  }

  /**
   * 상품 조회
   */
  async findById(id: string) {
    const product = await this.prismaService.$transaction(async (tx) => {
      const product = await this.productRepository.findById(id, tx);

      await this.commonProductService.validateNotFoundProduct(product);

      return product;
    });
    return product;
  }

  /**
   * 상품 수정
   */
  async update(id: string, dto: UpdateProductDto, updatedBy: string) {
    const updatedProduct = await this.prismaService.$transaction(async (tx) => {
      const product = await this.productRepository.findById(id, tx);

      await this.commonProductService.validateNotFoundProduct(product);

      await product.update({ ...dto, updatedBy: updatedBy });

      const updatedProduct = await this.productRepository.update(product, tx);

      if (dto.fishes.length > 0) {
        await this.productFishService.updateProductFishes(
          updatedProduct.id,
          dto.fishes,
          updatedBy,
          tx,
        );
      }

      return await this.productRepository.findById(updatedProduct.id, tx);
    });

    return updatedProduct;
  }

  /**
   * 상품 삭제
   */
  async delete(id: string, deletedBy: string) {
    const product = await this.prismaService.$transaction(async (tx) => {
      const product = await this.productRepository.findById(id, tx);

      await this.commonProductService.validateNotFoundProduct(product);

      await product.delete(deletedBy);

      const deletedProduct = await this.productRepository.update(product, tx);

      // 상품 어종 삭제
      await this.productFishService.deleteManyByProductId(
        deletedProduct.id,
        deletedBy,
        tx,
      );

      return deletedProduct;
    });

    return product;
  }
}

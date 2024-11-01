import { Module } from '@nestjs/common';
import { PartnersModule } from '../partners/partners.module';
import { CommonProductService } from './application/common.product.service';
import { ProductFishService } from './application/product-fish.service';
import { ProductService } from './application/product.service';
import { ProductFishRepository } from './infrastructure/product-fish.repository';
import { ProductRepository } from './infrastructure/product.repository';
import { ProductController } from './presentation/product.controller';

@Module({
  imports: [PartnersModule],
  controllers: [ProductController],
  providers: [
    CommonProductService,

    ProductService,
    ProductRepository,

    ProductFishService,
    ProductFishRepository,
  ],
  exports: [ProductService, ProductFishService, CommonProductService],
})
export class ProductModule {}

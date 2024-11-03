import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductEntity } from '../domain/product.entity';

@Injectable()
export class CommonProductService {
  async validateNotFoundProduct(product: ProductEntity) {
    if (!product) {
      throw new NotFoundException('상품을 찾을 수 없습니다.');
    }
  }

  async validateDisplayStatus(product: ProductEntity) {
    if (product.displayStatus === 'HIDE') {
      throw new NotFoundException('비공개된 상품입니다.');
    }
  }
}

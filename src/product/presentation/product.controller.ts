import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProductService } from '../application/product.service';
import { CreateProductDto } from './dto/request/create.product.dto';
import { FindAllProductDto } from './dto/request/find-all.product.dto';
import { UpdateProductDto } from './dto/request/update.product.dto';
import { CreateProductResponse } from './dto/response/create.product.response';
import { DeleteProductResponse } from './dto/response/delete.product.response';
import { FindAllProductResponse } from './dto/response/find-all.product.response';
import { UpdateProductResponse } from './dto/response/update.product.response';

@ApiTags('상품')
@Controller('products')
@ApiResponse({
  status: 400,
  description: '잘못된 입력',
})
@ApiResponse({
  status: 500,
  description: '서버 오류',
})
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  /**
   * 상품 생성
   */
  @Post()
  @ApiResponse({
    status: 201,
    description: '상품 생성 성공',
  })
  async create(@Body() dto: CreateProductDto) {
    const product = await this.productService.create(dto, dto.userId);
    return new CreateProductResponse(product);
  }

  /**
   * 상품 목록 조회
   */
  @Get()
  @ApiResponse({
    status: 200,
    description: '상품 목록 조회 성공',
  })
  async findAll(@Query() dto: FindAllProductDto) {
    const { datas, count } = await this.productService.findAll(dto);
    return new FindAllProductResponse(datas, count);
  }

  /**
   * 상품 조회
   */
  @Get(':id')
  @ApiResponse({
    status: 200,
    description: '상품 조회 성공',
  })
  @ApiResponse({
    status: 404,
    description: '상품을 찾을 수 없습니다.',
  })
  async findById(@Param('id') id: string) {
    const product = await this.productService.findById(id);
    return new CreateProductResponse(product);
  }

  /**
   * 상품 수정
   */
  @Patch(':id')
  @ApiResponse({
    status: 200,
    description: '상품 수정 성공',
  })
  @ApiResponse({
    status: 404,
    description: '상품을 찾을 수 없습니다.',
  })
  async update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    const product = await this.productService.update(id, dto, id);
    return new UpdateProductResponse(product);
  }

  /**
   * 상품 삭제
   */
  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: '상품 삭제 성공',
  })
  @ApiResponse({
    status: 404,
    description: '상품을 찾을 수 없습니다.',
  })
  async delete(@Param('id') id: string) {
    const product = await this.productService.delete(id, id);
    return new DeleteProductResponse(product);
  }
}

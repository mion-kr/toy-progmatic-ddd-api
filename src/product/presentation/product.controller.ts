import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { RoleType } from '@prisma/client';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles-guard';
import { Roles } from '../../shared/decorators/role.decorator';
import { User } from '../../shared/decorators/user.decorator';
import { UserEntity } from '../../user/domain/user.entity';
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
@UseGuards(RolesGuard)
@Roles(RoleType.PARTNER)
@UseGuards(JwtAuthGuard) // 이게 먼저 실행되고 그 다음에 RolesGuard가 실행됨
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
  async create(@Body() dto: CreateProductDto, @User() user: UserEntity) {
    const product = await this.productService.create(dto, user.snsId);
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
  @Roles(RoleType.PARTNER, RoleType.USER)
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
  @Roles(RoleType.PARTNER, RoleType.USER)
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
  @Roles(RoleType.PARTNER)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
    @User() user: UserEntity,
  ) {
    const product = await this.productService.update(id, dto, user.snsId);
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
  @Roles(RoleType.PARTNER)
  async delete(@Param('id') id: string, @User() user: UserEntity) {
    const product = await this.productService.delete(id, user.snsId);
    return new DeleteProductResponse(product);
  }
}

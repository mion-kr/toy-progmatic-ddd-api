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
import { PartnersService } from '../application/partners.service';
import { CreatePartnersDto } from './dto/request/create.partners.dto';
import { FindAllPartnersDto } from './dto/request/find-all.partners.dto';
import { UpdatePartnersDto } from './dto/request/update.partners.dto';
import { CreatePartnersResponse } from './dto/response/create.partners.response';
import { DeletePartnersResponse } from './dto/response/delete.partners.response';
import { FindAllPartnersResponse } from './dto/response/find.all.partners.response';
import { UpdatePartnersResponse } from './dto/response/update.partners.response';

@ApiTags('파트너스')
@Controller('partners')
@ApiResponse({
  status: 400,
  description: '잘못된 입력',
})
@ApiResponse({
  status: 500,
  description: '서버 오류',
})
export class PartnersController {
  constructor(private readonly partnersService: PartnersService) {}

  /**
   * 파트너스 생성
   */
  @Post()
  @ApiResponse({
    status: 201,
    description: '파트너스 생성 성공',
  })
  @ApiResponse({
    status: 409,
    description: '이미 존재하는 사업자등록번호',
  })
  async create(@Body() dto: CreatePartnersDto) {
    const partners = await this.partnersService.create(dto);
    return new CreatePartnersResponse(partners);
  }

  /**
   * 파트너스 목록 조회
   */
  @Get()
  @ApiResponse({
    status: 200,
    description: '파트너스 목록 조회 성공',
  })
  async findAll(@Query() dto: FindAllPartnersDto) {
    const { datas, count } = await this.partnersService.findAll(dto);
    return new FindAllPartnersResponse(datas, count);
  }

  /**
   * 파트너스 조회
   */
  @Get(':id')
  @ApiResponse({
    status: 200,
    description: '파트너스 조회 성공',
  })
  @ApiResponse({
    status: 404,
    description: '파트너스를 찾을 수 없습니다.',
  })
  async findById(@Param('id') id: string) {
    const partners = await this.partnersService.findById(id);
    return new CreatePartnersResponse(partners);
  }

  /**
   * 파트너스 수정
   */
  @Patch(':id')
  @ApiResponse({
    status: 200,
    description: '파트너스 수정 성공',
  })
  @ApiResponse({
    status: 404,
    description: '파트너스를 찾을 수 없습니다.',
  })
  async update(@Param('id') id: string, @Body() dto: UpdatePartnersDto) {
    const partners = await this.partnersService.update(id, dto, id);
    return new UpdatePartnersResponse(partners);
  }

  /**
   * 파트너스 삭제
   */
  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: '파트너스 삭제 성공',
  })
  @ApiResponse({
    status: 404,
    description: '파트너스를 찾을 수 없습니다.',
  })
  async delete(@Param('id') id: string) {
    const partners = await this.partnersService.delete(id, id);
    return new DeletePartnersResponse(partners);
  }
}

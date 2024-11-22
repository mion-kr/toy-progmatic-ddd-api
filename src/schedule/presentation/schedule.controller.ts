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
import { ScheduleService } from '../application/schedule.service';
import { CreateScheduleDto } from './dto/request/create-schedule.dto';
import { FindAllScheduleDto } from './dto/request/find-all-schedule.dto';
import { UpdateScheduleDto } from './dto/request/update-schedule.dto';
import { CreateScheduleResponse } from './dto/response/create-schedule.response';
import { DeleteScheduleResponse } from './dto/response/delete-schedule.response';
import { FindAllScheduleResponse } from './dto/response/find-all-schedule.response';
import { FindOneScheduleResponse } from './dto/response/find-one-schedule.response';
import { UpdateScheduleResponse } from './dto/response/update-schedule.response';

@ApiTags('스케줄')
@Controller('schedules')
@ApiResponse({
  status: 400,
  description: '잘못된 입력',
})
@ApiResponse({
  status: 500,
  description: '서버 오류',
})
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  /**
   * 스케줄 생성
   */
  @Post()
  @ApiResponse({
    status: 201,
    description: '스케줄 생성 성공',
  })
  async create(@Body() dto: CreateScheduleDto) {
    const schedule = await this.scheduleService.create(dto, dto.productId);
    return new CreateScheduleResponse(schedule);
  }

  /**
   * 스케줄 목록 조회
   */
  @Get()
  @ApiResponse({
    status: 200,
    description: '스케줄 목록 조회 성공',
  })
  async findAll(@Query() dto: FindAllScheduleDto) {
    const { datas, count } = await this.scheduleService.findAll(dto);
    return new FindAllScheduleResponse(datas, count);
  }

  /**
   * 스케줄 조회
   */
  @Get(':id')
  @ApiResponse({
    status: 200,
    description: '스케줄 조회 성공',
  })
  @ApiResponse({
    status: 404,
    description: '스케줄을 찾을 수 없습니다.',
  })
  async findById(@Param('id') id: string) {
    const schedule = await this.scheduleService.findById(id);
    return new FindOneScheduleResponse(schedule);
  }

  /**
   * 스케줄 수정
   */
  @Patch(':id')
  @ApiResponse({
    status: 200,
    description: '스케줄 수정 성공',
  })
  @ApiResponse({
    status: 404,
    description: '스케줄을 찾을 수 없습니다.',
  })
  async update(@Param('id') id: string, @Body() dto: UpdateScheduleDto) {
    const schedule = await this.scheduleService.update(id, dto, id);
    return new UpdateScheduleResponse(schedule);
  }

  /**
   * 스케줄 삭제
   */
  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: '스케줄 삭제 성공',
  })
  @ApiResponse({
    status: 404,
    description: '스케줄을 찾을 수 없습니다.',
  })
  async delete(@Param('id') id: string) {
    const schedule = await this.scheduleService.delete(id, id);
    return new DeleteScheduleResponse(schedule);
  }
}

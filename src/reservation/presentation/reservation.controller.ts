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
import { ReservationService } from '../application/reservation.service';
import { CancelReservationDto } from './dto/request/cancel-reservation.dto';
import { CreatePaymentDto } from './dto/request/create-payment.dto';
import { CreateReservationDto } from './dto/request/create-reservation.dto';
import { FindAllReservationDto } from './dto/request/find-all-reservation.dto';
import { CreateReservationResponse } from './dto/response/create-reservation.response';
import { DeleteReservationResponse } from './dto/response/delete-reservation.response';
import { FindAllReservationResponse } from './dto/response/find-all-reservation.response';

@ApiTags('예약')
@Controller('reservations')
@ApiResponse({
  status: 400,
  description: '잘못된 입력',
})
@ApiResponse({
  status: 500,
  description: '서버 오류',
})
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  /**
   * 예약 생성
   */
  @Post()
  @ApiResponse({
    status: 201,
    description: '예약 생성 성공',
  })
  async create(@Body() dto: CreateReservationDto) {
    const reservation = await this.reservationService.create(dto, dto.userId);
    return new CreateReservationResponse(reservation);
  }

  /**
   * 예약 목록 조회
   */
  @Get()
  @ApiResponse({
    status: 200,
    description: '예약 목록 조회 성공',
  })
  async findAll(@Query() dto: FindAllReservationDto) {
    const { datas, count } = await this.reservationService.findAll(dto);
    return new FindAllReservationResponse(datas, count);
  }

  /**
   * 예약 조회
   */
  @Get(':id')
  @ApiResponse({
    status: 200,
    description: '예약 조회 성공',
  })
  @ApiResponse({
    status: 404,
    description: '예약을 찾을 수 없습니다.',
  })
  async findById(@Param('id') id: string) {
    const reservation = await this.reservationService.findById(id);
    return new CreateReservationResponse(reservation);
  }

  /**
   * 예약 결제
   */
  @Patch(':id/payment')
  async payment(@Param('id') id: string, @Body() dto: CreatePaymentDto) {
    const reservation = await this.reservationService.payment(
      id,
      dto,
      dto.userId,
    );
    return new CreateReservationResponse(reservation);
  }

  /**
   * 예약 취소
   */
  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: '예약 취소 성공',
  })
  @ApiResponse({
    status: 404,
    description: '예약을 찾을 수 없습니다.',
  })
  async cancel(@Param('id') id: string, @Body() dto: CancelReservationDto) {
    const reservation = await this.reservationService.cancel(id, dto.userId);
    return new DeleteReservationResponse(reservation);
  }
}
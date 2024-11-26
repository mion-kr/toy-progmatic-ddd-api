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
import { ReservationService } from '../application/reservation.service';
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
@UseGuards(RolesGuard)
@UseGuards(JwtAuthGuard) // 이게 먼저 실행되고 그 다음에 RolesGuard가 실행됨
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
  @Roles(RoleType.USER)
  async create(@Body() dto: CreateReservationDto, @User() user: UserEntity) {
    const reservation = await this.reservationService.create(dto, user.snsId);
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
  @Roles(RoleType.PARTNER, RoleType.USER)
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
  @Roles(RoleType.PARTNER, RoleType.USER)
  async findById(@Param('id') id: string) {
    const reservation = await this.reservationService.findById(id);
    return new CreateReservationResponse(reservation);
  }

  /**
   * 예약 결제
   */
  @Patch(':id/payment')
  @Roles(RoleType.USER)
  async payment(
    @Param('id') id: string,
    @Body() dto: CreatePaymentDto,
    @User() user: UserEntity,
  ) {
    const reservation = await this.reservationService.payment(
      id,
      dto,
      user.snsId,
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
  @Roles(RoleType.USER)
  async cancel(@Param('id') id: string, @User() user: UserEntity) {
    const reservation = await this.reservationService.cancel(id, user.snsId);
    return new DeleteReservationResponse(reservation);
  }
}

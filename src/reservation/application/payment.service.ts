import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { PaymentEntity } from '../domain/payment.entity';
import { PaymentRepository } from '../infrastructure/payment.repository';
import { CreatePaymentDto } from '../presentation/dto/request/create-payment.dto';

@Injectable()
export class PaymentService {
  constructor(
    private readonly paymentRepository: PaymentRepository,
    private readonly prismaService: PrismaService,
  ) {}

  async create(
    reservationId: string,
    dto: CreatePaymentDto,
    tx?: Prisma.TransactionClient,
  ) {
    const fn = async (tx?: Prisma.TransactionClient) => {
      // 1. 결제 생성
      const payment = PaymentEntity.createNew({
        reservationId: reservationId,
        price: dto.price,
        createdBy: dto.userId,
      });

      // 2. 결제 정보 저장
      const createdPayment = await this.paymentRepository.create(payment, tx);

      return createdPayment;
    };

    return tx ? await fn(tx) : await this.prismaService.$transaction(fn);
  }
}

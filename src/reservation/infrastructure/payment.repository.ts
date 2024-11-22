import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { PaymentEntity } from '../domain/payment.entity';
import { IPaymentRepository } from '../domain/payment.repository.interface';

@Injectable()
export class PaymentRepository implements IPaymentRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findById(
    id: string,
    tx?: Prisma.TransactionClient,
  ): Promise<PaymentEntity | null> {
    const prisma = tx ?? this.prismaService;

    const payment = await prisma.payment.findUnique({
      where: { id, deletedAt: null },
    });

    return payment ? PaymentEntity.fromPersistence(payment) : null;
  }

  async findByReservationId(
    reservationId: string,
    tx?: Prisma.TransactionClient,
  ): Promise<PaymentEntity | null> {
    const prisma = tx ?? this.prismaService;

    const payment = await prisma.payment.findFirst({
      where: { reservationId, deletedAt: null },
    });

    return payment ? PaymentEntity.fromPersistence(payment) : null;
  }

  async create(
    payment: PaymentEntity,
    tx?: Prisma.TransactionClient,
  ): Promise<PaymentEntity> {
    const prisma = tx ?? this.prismaService;

    const createdPayment = await prisma.payment.create({
      data: {
        id: payment.id,
        reservationId: payment.reservationId,
        price: payment.price,
        createdBy: payment.createdBy,
        createdAt: payment.createdAt,
        updatedBy: payment.updatedBy,
        updatedAt: payment.updatedAt,
      },
    });

    return PaymentEntity.fromPersistence(createdPayment);
  }
}

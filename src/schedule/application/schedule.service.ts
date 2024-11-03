import { Injectable } from '@nestjs/common';
import { CommonProductService } from '../../product/application/common.product.service';
import { ProductService } from '../../product/application/product.service';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { ScheduleEntity } from '../domain/schedule.entity';
import { ScheduleRepository } from '../infrastructure/schedule.repository';
import { CreateScheduleDto } from '../presentation/dto/request/create-schedule.dto';
import { FindAllScheduleDto } from '../presentation/dto/request/find-all-schedule.dto';
import { UpdateScheduleDto } from '../presentation/dto/request/update-schedule.dto';
import { CommonScheduleService } from './common-schedule.service';
import { ScheduleFishService } from './schedule-fish.service';

@Injectable()
export class ScheduleService {
  constructor(
    private readonly scheduleRepository: ScheduleRepository,
    private readonly commonScheduleService: CommonScheduleService,
    private readonly commonProductService: CommonProductService,
    private readonly scheduleFishService: ScheduleFishService,
    private readonly productService: ProductService,
    private readonly prismaService: PrismaService,
  ) {}

  async create(dto: CreateScheduleDto, createdBy: string) {
    const createdSchedule = await this.prismaService.$transaction(
      async (tx) => {
        const product = await this.productService.findById(dto.productId);

        await this.commonProductService.validateNotFoundProduct(product);

        const schedule = ScheduleEntity.createNew({
          ...dto,
          createdBy,
        });

        const createdSchedule = await this.scheduleRepository.create(
          schedule,
          tx,
        );

        if (dto.scheduleFishes.length > 0) {
          await this.scheduleFishService.updateScheduleFishes(
            createdSchedule.id,
            dto.scheduleFishes,
            createdBy,
            tx,
          );
        }

        return createdSchedule;
      },
    );

    return createdSchedule;
  }

  async findAll(dto: FindAllScheduleDto) {
    const { datas, count } = await this.scheduleRepository.findAll(dto);
    return { datas, count };
  }

  async findById(id: string) {
    const schedule = await this.prismaService.$transaction(async (tx) => {
      const schedule = await this.scheduleRepository.findById(id, tx);

      await this.commonScheduleService.validateNotFoundSchedule(schedule);

      schedule.fishes = await this.scheduleFishService.findAllByScheduleId(
        schedule.id,
        tx,
      );

      return schedule;
    });
    return schedule;
  }

  async update(id: string, dto: UpdateScheduleDto, updatedBy: string) {
    const updatedSchedule = await this.prismaService.$transaction(
      async (tx) => {
        const schedule = await this.scheduleRepository.findById(id);

        await this.commonScheduleService.validateNotFoundSchedule(schedule);

        await schedule.update({ ...dto, updatedBy: updatedBy });

        const updatedSchedule = await this.scheduleRepository.update(
          schedule,
          tx,
        );

        if (dto.fishes.length > 0) {
          await this.scheduleFishService.updateScheduleFishes(
            updatedSchedule.id,
            dto.fishes,
            updatedBy,
            tx,
          );
        }

        return updatedSchedule;
      },
    );

    return updatedSchedule;
  }

  async delete(id: string, deletedBy: string) {
    const schedule = await this.prismaService.$transaction(async (tx) => {
      const schedule = await this.scheduleRepository.findById(id, tx);

      await this.commonScheduleService.validateNotFoundSchedule(schedule);

      await schedule.delete(deletedBy);

      const deletedSchedule = await this.scheduleRepository.update(
        schedule,
        tx,
      );

      await this.scheduleFishService.deleteManyByScheduleId(
        deletedSchedule.id,
        deletedBy,
        tx,
      );

      return deletedSchedule;
    });

    return schedule;
  }
}

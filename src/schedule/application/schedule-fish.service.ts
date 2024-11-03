import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ScheduleFishEntity } from '../domain/schedule-fish.entity';
import { ScheduleFishRepository } from '../infrastructure/schedule-fish.repository';
import { UpdateScheduleFishDto } from '../presentation/dto/request/update-schedule-fish.dto';

@Injectable()
export class ScheduleFishService {
  constructor(
    private readonly scheduleFishRepository: ScheduleFishRepository,
  ) {}

  async findAllByScheduleId(
    id: string,
    tx?: Prisma.TransactionClient,
  ): Promise<ScheduleFishEntity[]> {
    return this.scheduleFishRepository.findAllByScheduleId(id, tx);
  }

  async updateScheduleFishes(
    scheduleId: string,
    dto: UpdateScheduleFishDto[],
    updatedBy: string,
    tx?: Prisma.TransactionClient,
  ) {
    const scheduleFishes =
      await this.scheduleFishRepository.findAllByScheduleId(scheduleId, tx);

    await this.handleDeletedFishes(scheduleFishes, dto, updatedBy, tx);

    await this.handleCreatedFishes(dto, scheduleId, updatedBy, tx);

    await this.handleUpdatedFishes(scheduleFishes, dto, updatedBy, tx);
  }

  /**
   * 스케줄에서 생성된 어종 처리
   */
  private async handleCreatedFishes(
    dto: UpdateScheduleFishDto[],
    scheduleId: string,
    updatedBy: string,
    tx?: Prisma.TransactionClient,
  ) {
    const scheduleFishesToCreate = dto
      .filter((dto) => !dto.id)
      .map((dto) =>
        ScheduleFishEntity.createNew({
          scheduleId: scheduleId,
          fishId: dto.fishId,
          createdBy: updatedBy,
        }),
      );

    await this.scheduleFishRepository.createMany(scheduleFishesToCreate, tx);
  }

  /**
   * 스케줄에서 수정된 어종 처리
   */
  private async handleUpdatedFishes(
    scheduleFishes: ScheduleFishEntity[],
    dto: UpdateScheduleFishDto[],
    updatedBy: string,
    tx?: Prisma.TransactionClient,
  ) {
    const scheduleFishesToUpdate = scheduleFishes
      .filter((fish) => dto.some((dto) => dto.id === fish.id))
      .map((savedFish) => {
        savedFish.update({
          ...dto.find((dto) => dto.id === savedFish.id),
          updatedBy,
        });
        return savedFish;
      });

    for (const scheduleFishToUpdate of scheduleFishesToUpdate) {
      await this.scheduleFishRepository.update(scheduleFishToUpdate, tx);
    }
  }

  /**
   * 스케줄에서 삭제된 어종 처리
   */
  private async handleDeletedFishes(
    scheduleFishes: ScheduleFishEntity[],
    dto: UpdateScheduleFishDto[],
    updatedBy: string,
    tx?: Prisma.TransactionClient,
  ) {
    const scheduleFishesToDelete = scheduleFishes
      .filter((fish) =>
        dto.some((dto) => dto.id === fish.id && dto.isDeleted === true),
      )
      .map((fish) => {
        fish.delete(updatedBy);
        return fish;
      });

    for (const scheduleFishToDelete of scheduleFishesToDelete) {
      await this.scheduleFishRepository.update(scheduleFishToDelete, tx);
    }
  }

  async deleteManyByScheduleId(
    scheduleId: string,
    deletedBy: string,
    tx?: Prisma.TransactionClient,
  ) {
    await this.scheduleFishRepository.deleteManyByScheduleId(
      scheduleId,
      deletedBy,
      tx,
    );
  }
}

import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { UserRoleEntity } from '../domain/user-role.entity';
import { UserRoleRepository } from '../infrastructure/user-role.repository';
import { UpdateRoleUserDto } from '../presentation/dto/request/update-role.user.dto';

@Injectable()
export class UserRoleService {
  constructor(private readonly userRoleRepository: UserRoleRepository) {}

  async updateUserRoles(
    userId: string,
    dto: UpdateRoleUserDto[],
    tx?: Prisma.TransactionClient,
  ) {
    const userRoles = await this.userRoleRepository.findAllByUserId(userId, tx);

    await this.handleDeletedRoles(dto, userRoles, tx);

    await this.handleCreatedRoles(dto, userId, userRoles, tx);

    await this.handleUpdatedRoles(dto, userId, userRoles, tx);
  }

  /**
   * 추가된 권한 처리
   * @param dto
   * @param productId
   * @param updatedBy
   * @param tx
   */
  private async handleCreatedRoles(
    dto: UpdateRoleUserDto[],
    userId: string,
    savedUserRoles: UserRoleEntity[],
    tx?: Prisma.TransactionClient,
  ) {
    const userRolesToCreate = await Promise.all(
      dto
        .filter(
          (dto) =>
            !savedUserRoles.some(
              (saved) => saved.roleId === dto.role && saved.userId === userId,
            ),
        )
        .map((dto) =>
          UserRoleEntity.createNew({
            userId: userId,
            roleId: dto.role,
          }),
        ),
    );

    await this.userRoleRepository.createMany(userRolesToCreate, tx);
  }

  /**
   * 수정된 권한 처리
   */
  private async handleUpdatedRoles(
    dto: UpdateRoleUserDto[],
    userId: string,
    savedUserRoles: UserRoleEntity[],
    tx?: Prisma.TransactionClient,
  ) {
    const userRolesToUpdate = savedUserRoles
      .filter((role) =>
        dto.some((dto) => dto.role === role.roleId && dto.isDeleted !== true),
      )
      .map((savedRole) => {
        savedRole.update({
          roleId: dto.find((dto) => dto.role === savedRole.roleId)?.role,
          userId,
        });
        return savedRole;
      });

    for (const userRoleToUpdate of userRolesToUpdate) {
      await this.userRoleRepository.update(userRoleToUpdate, tx);
    }
  }

  /**
   * 삭제된 권한 처리(물리)
   */
  private async handleDeletedRoles(
    dto: UpdateRoleUserDto[],
    savedUserRoles: UserRoleEntity[],
    tx?: Prisma.TransactionClient,
  ) {
    const userRolesToDelete = savedUserRoles.filter((role) =>
      dto.some((dto) => dto.role === role.roleId && dto.isDeleted === true),
    );
    for (const userRoleToDelete of userRolesToDelete) {
      await this.userRoleRepository.deleteByUserIdAndRoleId(
        userRoleToDelete.userId,
        userRoleToDelete.roleId,
        tx,
      );
    }
  }

  /**
   * 유저 권한 삭제(물리)
   * @param userId
   * @param tx
   */
  async deleteManyByUserId(userId: string, tx?: Prisma.TransactionClient) {
    await this.userRoleRepository.deleteManyByUserId(userId, tx);
  }
}

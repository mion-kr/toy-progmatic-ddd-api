import { RoleType } from '@prisma/client';
import { UserRoleEntity } from './user-role.entity';

export interface IUserRoleRepository {
  findAllByUserId(userId: string): Promise<UserRoleEntity[]>;
  createMany(userRoles: UserRoleEntity[]): Promise<void>;
  update(userRole: UserRoleEntity): Promise<void>;
  deleteByUserIdAndRoleId(userId: string, roleId: RoleType): Promise<void>;
  deleteManyByUserId(userId: string): Promise<void>;
}

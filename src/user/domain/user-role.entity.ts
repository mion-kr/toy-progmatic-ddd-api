import { RoleType, UserRole } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';

@Exclude() // 기본적으로 모든 속성 숨김
export class UserRoleEntity implements UserRole {
  private _userId: string;
  private _roleId: RoleType;

  private constructor(props: UserRole) {
    this.setUserId(props.userId);
    this._roleId = props.roleId;
  }

  static async createNew(props: UserRole): Promise<UserRoleEntity> {
    const entity = new UserRoleEntity({
      ...props,
    });
    return entity;
  }

  static fromPersistence(props: UserRole): UserRoleEntity {
    return new UserRoleEntity(props);
  }

  async update(props: Partial<UserRole>): Promise<void> {
    this._roleId = props?.roleId;
  }

  private setUserId(userId: string) {
    if (!userId) {
      throw new Error('userId is required');
    }
    this._userId = userId;
  }

  @Expose()
  get userId(): string {
    return this._userId;
  }

  @Expose()
  get roleId(): RoleType {
    return this._roleId;
  }
}

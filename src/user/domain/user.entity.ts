import { User } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';
import { AbstractSchema } from '../../shared/schema/abstract.schema';

@Exclude() // 기본적으로 모든 속성 숨김
export class UserEntity extends AbstractSchema implements User {
  private _snsId: string;
  private _password: string;
  private _email: string;
  private _nickName: string;
  private _profileImage: string;

  private constructor(props: Partial<User>) {
    super(props);
    this.setSnsId(props.snsId);
    this._password = props.password;
    this._email = props.email;
    this._nickName = props.nickName;
    this._profileImage = props.profileImage;
  }

  static create(props: Partial<User>): UserEntity {
    const entity = new UserEntity(props);
    entity.setCreatedInfo(props.createdBy);
    return entity;
  }

  async update(props: Partial<User>): Promise<void> {
    this._email = props?.email;
    this._nickName = props?.nickName;
    this._profileImage = props?.profileImage;
    this.setUpdatedInfo(props.updatedBy);
  }

  async delete(props: Partial<User>): Promise<void> {
    this.setDeletedInfo(props.deletedBy);
  }

  private setSnsId(snsId: string) {
    if (!snsId) {
      throw new Error('snsId is required');
    }
    this._snsId = snsId;
  }

  @Expose()
  get snsId(): string {
    return this._snsId;
  }

  get password(): string {
    return this._password;
  }

  @Expose()
  get email(): string {
    return this._email;
  }

  @Expose()
  get nickName(): string {
    return this._nickName;
  }

  @Expose()
  get profileImage(): string {
    return this._profileImage;
  }
}

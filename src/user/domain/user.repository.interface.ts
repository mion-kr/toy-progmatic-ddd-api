import { UserEntity } from './user.entity';

export interface IUserRepository {
  findOneBySnsId(snsId: string): Promise<UserEntity | null>;
  findByEmail(email: string): Promise<UserEntity | null>;
  create(user: UserEntity): Promise<void>;
  update(user: UserEntity): Promise<void>;
}

import { Module } from '@nestjs/common';
import { CommonUserService } from './application/common.user.service';
import { UserRoleService } from './application/user-role.service';
import { UserService } from './application/user.service';
import { UserRoleRepository } from './infrastructure/user-role.repository';
import { UserRepository } from './infrastructure/user.repository';
import { UserController } from './presentation/user.controller';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [
    UserService,
    UserRepository,
    CommonUserService,

    UserRoleService,
    UserRoleRepository,
  ],
  exports: [UserService, CommonUserService],
})
export class UserModule {}

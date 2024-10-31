import { Module } from '@nestjs/common';
import { CommonUserService } from './application/common.user.service';
import { UserService } from './application/user.service';
import { UserRepository } from './infrastructure/user.repository';
import { UserController } from './presentation/user.controller';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [UserService, UserRepository, CommonUserService],
  exports: [],
})
export class UserModule {}

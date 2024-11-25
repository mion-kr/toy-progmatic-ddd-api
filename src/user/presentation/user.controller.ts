import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiExtraModels, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RoleType } from '@prisma/client';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles-guard';
import { Public } from '../../shared/decorators/jwt-public.decorator';
import { Roles } from '../../shared/decorators/role.decorator';
import { User } from '../../shared/decorators/user.decorator';
import { UserService } from '../application/user.service';
import { UserEntity } from '../domain/user.entity';
import { CreateUserDto } from './dto/request/create.user.dto';
import { UpdateUserDto } from './dto/request/update.user.dto';
import { CreateUserResponse } from './dto/response/create.user.response';
import { DeleteUserResponse } from './dto/response/delete.user.response';
import { UpdateUserResponse } from './dto/response/update.user.response';

@ApiTags('유저')
@Controller('users')
@ApiResponse({
  status: 400,
  description: '잘못된 입력',
})
@ApiResponse({
  status: 500,
  description: '서버 오류',
})
@UseGuards(RolesGuard)
@Roles(RoleType.USER)
@UseGuards(JwtAuthGuard) // 이게 먼저 실행되고 그 다음에 RolesGuard가 실행됨
@ApiExtraModels(CreateUserResponse)
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * 사용자 생성
   */
  @Public()
  @Post()
  @ApiResponse({
    status: 201,
    description: '사용자 생성 성공',
    type: CreateUserResponse,
  })
  @ApiResponse({
    status: 409,
    description: '이미 존재하는 사용자',
  })
  async create(@Body() dto: CreateUserDto) {
    const user = await this.userService.create(dto);
    return new CreateUserResponse(user);
  }

  /**
   * 로그인 사용자 조회
   */
  @Get('me')
  @ApiResponse({
    status: 200,
    description: '사용자 조회 성공',
  })
  @ApiResponse({
    status: 404,
    description: '사용자를 찾을 수 없습니다.',
  })
  async findMe(@User() loginUser: UserEntity) {
    const user = await this.userService.findOneBySnsId(loginUser.snsId);
    return new CreateUserResponse(user);
  }

  /**
   * 사용자 조회
   */
  @Get(':snsId')
  @ApiResponse({
    status: 200,
    description: '사용자 조회 성공',
  })
  @ApiResponse({
    status: 404,
    description: '사용자를 찾을 수 없습니다.',
  })
  async findBySnsId(@Param('snsId') snsId: string) {
    const user = await this.userService.findOneBySnsId(snsId);
    return new CreateUserResponse(user);
  }

  /**
   * 사용자 수정
   */
  @Patch(':snsId')
  @ApiResponse({
    status: 200,
    description: '사용자 수정 성공',
  })
  @ApiResponse({
    status: 404,
    description: '사용자를 찾을 수 없습니다.',
  })
  async update(@Param('snsId') snsId: string, @Body() dto: UpdateUserDto) {
    const user = await this.userService.update(snsId, dto);
    return new UpdateUserResponse(user);
  }

  /**
   * 사용자 삭제
   */
  @Delete(':snsId')
  @ApiResponse({
    status: 200,
    description: '사용자 삭제 성공',
  })
  @ApiResponse({
    status: 404,
    description: '사용자를 찾을 수 없습니다.',
  })
  async delete(@Param('snsId') snsId: string) {
    await this.userService.delete(snsId);
    return new DeleteUserResponse({ snsId });
  }
}

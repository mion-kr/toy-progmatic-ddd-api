import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { AuthService } from '../application/auth.service';
import { UserLoginGuard } from '../guards/user-login.guard';
import { LoginUserDto } from './dto/request/login.dto';

@ApiTags('인증')
@Controller('auth')
@ApiResponse({
  status: 400,
  description: '잘못된 입력',
})
@ApiResponse({
  status: 500,
  description: '서버 오류',
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * 로그인
   */
  @Post('login')
  @ApiResponse({
    status: 201,
    description: '로그인 성공',
  })
  @ApiResponse({
    status: 401,
    description: '인증 실패',
  })
  @UseGuards(UserLoginGuard)
  async login(
    @Body() dto: LoginUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const jwt = await this.authService.loginUser(dto, response);
    response.send(jwt);
  }
}

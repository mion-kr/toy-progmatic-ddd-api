import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { UserService } from '../../user/application/user.service';
import { UserEntity } from '../../user/domain/user.entity';
import { UserTokenPayload } from '../interface/user-token-payload.interface';
import { LoginUserDto } from '../presentation/dto/request/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async verifyUser(snsId: string, password: string): Promise<UserEntity> {
    const user = await this.userService.findOneBySnsId(snsId);
    const isValidPassword = await user.isValidPassword(password);
    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid password');
    }

    return user;
  }

  async loginUser(dto: LoginUserDto, response: Response) {
    const tokenPayload: UserTokenPayload = {
      snsId: dto.snsId,
    };

    const expires = new Date();
    const expiration = Number(this.configService.get('JWT_EXPIRATION'));
    expires.setSeconds(expires.getSeconds() + expiration);

    const token = this.jwtService.sign(tokenPayload);

    response.cookie('Authentication', token, {
      httpOnly: true,
      expires,
      path: '/',
    });

    return token;
  }
}

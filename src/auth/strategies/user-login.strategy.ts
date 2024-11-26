import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../application/auth.service';

@Injectable()
export class UserLoginStrategy extends PassportStrategy(
  Strategy,
  'user-login',
) {
  constructor(private readonly authService: AuthService) {
    super({ usernameField: 'snsId' });
  }

  async validate(snsId: string, password: string): Promise<any> {
    try {
      const { password: _, ...userWithoutPassword } =
        await this.authService.verifyUser(snsId, password);

      return userWithoutPassword;
    } catch (err) {
      throw new UnauthorizedException(err);
    }
  }
}

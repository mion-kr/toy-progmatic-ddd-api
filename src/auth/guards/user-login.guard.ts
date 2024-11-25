import { AuthGuard } from '@nestjs/passport';

export class UserLoginGuard extends AuthGuard('user-login') {}

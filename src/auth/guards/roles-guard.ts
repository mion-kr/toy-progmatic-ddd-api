import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { publicKey } from '../../shared/decorators/jwt-public.decorator';
import { UserEntity } from '../../user/domain/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.get<boolean>(
      publicKey,
      context.getHandler(),
    );

    if (isPublic) return true;

    // ROLES 데코레이터(메타)를 통하여 전달된 접근 권한 리스트
    const roles =
      this.reflector.get<string[]>('roles', context.getHandler()) ??
      this.reflector.get<string[]>('roles', context.getClass()); // 클래스 레벨에서 정의된 @Roles 정보를 갖고 옵니다.
    // ROLES 데코레이터에 접근 권한이 정의 되지 않은 경우 접근 허용
    if (!roles) {
      return true;
    }

    const noPermissionMessage =
      this.reflector.get<string>(
        'no_permission_message',
        context.getHandler(),
      ) ??
      this.reflector.get<string>('no_permission_message', context.getClass()); // 클래스 레벨에서 정의된 @NoPermissionMessage 정보를 갖고 옵니다.

    // 리퀘스트에 저장된 로그인 사용자 권한 정보와 접근 권한 비교 판별
    const request = context.switchToHttp().getRequest();
    const user = request.user as UserEntity;

    const hasRole =
      user && user.roles && user.roles.some((role) => roles.includes(role));

    if (hasRole) return true;

    throw new ForbiddenException(
      noPermissionMessage ?? '해당 API에 대한 권한이 없습니다.',
    );
  }
}

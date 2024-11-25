import { SetMetadata } from '@nestjs/common';
import { RoleType } from '@prisma/client';

/**
 *  ROLES 데코레이터
 * @param roles
 * @constructor
 */
export const Roles = (...roles: RoleType[]): any => SetMetadata('roles', roles);

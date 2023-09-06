import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from 'src/types/user-roles.type';
import { ROLES_KEY } from '../decorators/roles.decorator';

/*
  const matchRoles = (roles, userRoles) => {
  return roles.some((role) => role === userRoles);
};
 */

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    if (!user) {
      return false;
    }
    return requiredRoles.some((role) => user.role?.includes(role));
  }
}

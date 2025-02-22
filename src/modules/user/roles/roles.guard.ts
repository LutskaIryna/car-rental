import { Injectable, CanActivate, ExecutionContext, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';
import { Role } from './roles.enum';
import { RegisterDTO } from '../dto/register.dto';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  private readonly logger = new Logger(RolesGuard.name);


  canActivate(context: ExecutionContext): boolean {
    
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    this.logger.log(requiredRoles);
    if (!requiredRoles) {
      return true;
    }

    const { user }: {user: RegisterDTO} = context.switchToHttp().getRequest();
    this.logger.log(user);
    return requiredRoles.includes(user.role);
  }
}

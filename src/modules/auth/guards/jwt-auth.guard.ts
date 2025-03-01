import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();

    // Extract JWT from Authorization header
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or invalid token');
    }

    const token = authHeader.split(' ')[1]; // Extract the token
    try {
      // Verify token using jsonwebtoken
      const secret = this.configService.get<string>('JWT_SECRET');
      const decoded = jwt.verify(token, secret || '');

      // Attach user info to the request
      request.user = decoded;
      return true; // Allow request
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}

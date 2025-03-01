import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/modules/auth/services/user.service';
import { User } from '../entities/user.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {

  constructor(
    private userService: UserService,
    private configService: ConfigService,
    private jwtService: JwtService
  ) {}

  async login(user: User ) {
    const payload = { id: user.id, email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload);
    
    
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'), 
      expiresIn: this.configService.get<string>('EXPIRES_IN_REFRESH_TOKEN'),
    });
    
    await this.userService.save({ id: user.id, token: accessToken, refreshToken: refreshToken});

    return {
        access_token: accessToken,
        refresh_token: refreshToken
      };
  } 
  
  async logout(id: string) {
    await this.userService.update({ id, token: null, refreshToken: null});
  }

  getCookies(cookieHeader: string): Record<string, string> {
    return Object.fromEntries(
      cookieHeader.split('; ').map((c: string): [string, string] => {
        const [key, value] = c.split('=');
        return [key.trim(), value ? decodeURIComponent(value) : ''];
      })
    );
  }
}

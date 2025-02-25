import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/modules/auth/services/user.service';
import { User } from '../entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { PasswordService } from './password.service';

@Injectable()
export class AuthService {

  constructor(
    private userService: UserService,
    private configService: ConfigService,
    private passwordService: PasswordService,
    private jwtService: JwtService
  ) {}

  async login(user: User ) {
    const payload = { id: user.id, email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload);
    const hashedAccessToken = await this.passwordService.hashPassword(accessToken);
    // const hashedAccessToken = await this.passwordService.getHashedAccessToken(user);
    
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'), 
      expiresIn: this.configService.get<string>('EXPIRES_IN_REFRESH_TOKEN'),
    });
    const hashedRefreshToken = await this.passwordService.hashPassword(refreshToken)
    
    await this.userService.save({ id: user.id, token: hashedAccessToken, refreshToken: hashedRefreshToken});

    return {
        access_token: accessToken,
        refresh_token: refreshToken
      };
  } 
  
  async logout(id: string) {
    await this.userService.update({ id, token: null, refreshToken: null});
  }
}

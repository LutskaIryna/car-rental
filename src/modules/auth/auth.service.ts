import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/modules/user/user.service';
import { RegisterDTO } from '../user/dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) {}
  private readonly logger = new Logger(AuthService.name);

  async validateUser(email: string, password: string): Promise<RegisterDTO> {
    const user = await this.userService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async login(user: IUser ) {
    const payload = { id: user.id, email: user.email, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}

export interface IUser {
  id: string;
  email: string;
  role: string;
}
import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  Res,
  Req,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from '../entities/user.entity';
import { Response, Request } from 'express';
import ms, { StringValue } from 'ms';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@ApiBearerAuth()
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private userService: UserService
  ) {}

  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'user@example.com' },
        password: { type: 'string', example: 'password123' },
      },
      required: ['email', 'password'],
    },
  })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  async login(
    @Body() { email, password }: { email: string; password: string },
    @Res() res: Response
  ) {
    const user = await this.userService.validateUser(email, password);

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }
    const tokens = await this.authService.login(user);

    const refreshTokenAge = +ms(
      this.configService.get<string>('EXPIRES_IN_REFRESH_TOKEN') as StringValue
    );
    res.setHeader(
      'Set-Cookie',
      `refresh_token=${tokens.refresh_token}; HttpOnly; Path=/; Max-Age=${refreshTokenAge}`
    );

    return res.json({ access_token: tokens.access_token });
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(
    @Req() req: Request & { user?: { id: string } },
    @Res({ passthrough: true }) res: Response
  ) {
    const userId = req.user?.id;

    res.cookie('refresh_token', '', {
      httpOnly: true,
      path: '/',
      maxAge: 0,
    });

    await this.authService.logout(userId as string);
    return { message: 'Logged out successfully' };
  }

  @Post('refresh')
  async refresh(@Req() req: Request, @Res() res: Response) {
    const cookieHeader = req.headers.cookie;

    if (!cookieHeader) {
      throw new UnauthorizedException('No cookies found');
    }

    const cookies = this.authService.getCookies(cookieHeader);
    const refreshToken = cookies['refresh_token'];

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token missing');
    }

    const payload = this.jwtService.verify<{
      id: string;
      email: string;
      role: string;
    }>(refreshToken, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
    });

    const existingRefreshToken = await this.userService.getUserRefreshToken(
      payload.id
    );

    if (existingRefreshToken !== refreshToken)
      throw new UnauthorizedException('Invalid refresh token');

    const tokens = await this.authService.login(payload as User);

    const expiresInRefreshToken = this.configService.get<string>(
      'EXPIRES_IN_REFRESH_TOKEN'
    );
    if (!expiresInRefreshToken) {
      throw new Error(
        'EXPIRES_IN_REFRESH_TOKEN is not defined in the configuration'
      );
    }
    const refreshTokenAge: number = +ms(expiresInRefreshToken as StringValue);
    res.setHeader(
      'Set-Cookie',
      `refresh_token=${tokens.refresh_token}; HttpOnly; Path=/; Max-Age=${refreshTokenAge}`
    );

    return res.json({ access_token: tokens.access_token });
  }
}

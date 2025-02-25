import { Controller, Post, Body, UnauthorizedException, Res, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from '../entities/user.entity';
import { Request, Response } from 'express';


@ApiBearerAuth()
@ApiTags("auth")
@Controller("auth")
export class AuthController {

  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private userService: UserService
  ){}


  @Post('login')
  @ApiOperation({ summary: "Login user" })
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        email: { type: "string", example: "user@example.com" },
        password: { type: "string", example: "password123" },
      },
      required: ["email", "password"],
    },
  })
  @ApiResponse({ status: 403, description: "Forbidden." })
  async login(@Body() { email, password }: { email: string; password: string; }, @Res() res: Response) {
    const user = await this.userService.validateUser(email, password);  

    if (!user) {
      throw new UnauthorizedException("Invalid email or password");
    }
    const tokens = await this.authService.login(user);
    res.setHeader('Set-Cookie', `refresh_token=${tokens.refresh_token}; HttpOnly; Path=/; Max-Age=${7 * 24 * 60 * 60}`);
  
    return res.json({access_token: tokens.access_token, rft: tokens.refresh_token})
  }


  @Post('logout')
  @ApiOperation({ summary: "Logout user" })
  async logout(@Body() body: Request & { user?: { id: string } }, @Res({ passthrough: true }) res: Response) {
      const userId = body.user?.id; // Extract user ID from JWT payload

      if (!userId) {
          throw new UnauthorizedException("User not authenticated");
      }
  
      // Clear refresh token cookie
      res.cookie('refresh_token', '', {
          httpOnly: true,
          path: '/',
          maxAge: 0
      });
  
      // Call logout function in AuthService
      await this.authService.logout(userId);
  
      return { message: 'Logged out successfully' };
  }

  @Post('refresh')
    async refresh(@Req() req: Request, @Res() res: Response) {
      const cookieHeader = req.headers.cookie;

      if (!cookieHeader) {
        throw new UnauthorizedException('No cookies found');
      }

      const cookies: Record<string, string> = Object.fromEntries(
        cookieHeader.split('; ').map((c: string): [string, string] => {
          const [key, value] = c.split('=');
          return [key.trim(), value ? decodeURIComponent(value) : ''];
        })
      );
      const refreshToken = cookies['refresh_token'];

      if (!refreshToken) {
        throw new UnauthorizedException('Refresh token missing');
      }
  
  
    const payload = this.jwtService.verify<{ id: string, email: string, role: string }>(refreshToken, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
    });

    const isValid = await this.userService.validateRefreshToken(payload.id, refreshToken);

    if (!isValid) throw new UnauthorizedException('Invalid refresh token');

    const tokens = await this.authService.login(payload as User);
    res.setHeader('Set-Cookie', `refresh_token=${tokens.refresh_token}; HttpOnly; Path=/; Max-Age=${7 * 24 * 60 * 60}`);
  
    return res.json({access_token: tokens.access_token})
  }
}
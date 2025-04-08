import {
  Controller,
  Post,
  Body,
  BadRequestException,
  UseGuards,
  HttpStatus,
  Get,
  Req,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import {
  ApiOperation,
  ApiBearerAuth,
  ApiTags,
  ApiResponse,
} from '@nestjs/swagger';
import { RegisterDTO } from '../dto/register.dto';
import { Role } from '../enums/roles.enum';
import { AuthService } from '../services/auth.service';
import { Roles } from '../decorators/roles.decorator';
import { RolesGuard } from '../guards/roles.guard';
import { Public } from '../decorators/public.decorator';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@ApiBearerAuth()
@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService
  ) {}

  @Post('register')
  @Public()
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  async register(@Body() body: RegisterDTO) {
    const { email, password } = body;

    if (!email || !password) {
      throw new BadRequestException('Email and password are required');
    }
    return this.userService.register(email, password, Role.USER);
  }

  @Post('/register-role')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Register a new user with role' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  async createUserWithRole(
    @Body()
    { email, password, role }: { email: string; password: string; role: Role }
  ) {
    if (role === Role.SUPER_ADMIN || !Object.values(Role).includes(role)) {
      throw new BadRequestException('Invalid role');
    }
    return this.userService.register(email, password, role);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@Req() req: Request & { user?: { email: string } }) {
    const email = req.user?.email || '';
    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { token, refreshToken, password, ...safeUser } = user;

    return safeUser;
  }
}

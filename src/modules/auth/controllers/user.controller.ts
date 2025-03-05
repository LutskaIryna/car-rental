import {
  Controller,
  Post,
  Body,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import {
  ApiOperation,
  ApiBody,
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
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async register(@Body() body: RegisterDTO) {
    const { email, password } = body;

    if (!email || !password) {
      throw new BadRequestException('Email and password are required');
    }
    return this.userService.register(email, password, Role.USER);
  }

  @Post('/register-super-admin') // it is not neccessary to have this endpoint in swagger
  @Public()
  async createSuperAdmin(
    @Body() { email, password }: { email: string; password: string }
  ) {
    return this.userService.registerAdmin(email, password, Role.SUPER_ADMIN);
  }

  @Post('/register-role')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Register a new user with role' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async createUserWithRole(
    @Body()
    { email, password, role }: { email: string; password: string; role: Role }
  ) {
    if (role === Role.SUPER_ADMIN || !Object.values(Role).includes(role)) {
      throw new BadRequestException('Invalid role');
    }
    return this.userService.register(email, password, role);
  }
}

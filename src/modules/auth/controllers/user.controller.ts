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
  Delete,
  Param,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import {
  ApiOperation,
  ApiBearerAuth,
  ApiTags,
  ApiResponse,
  ApiParam,
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

  @Get('')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @ApiOperation({ summary: 'Get users' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  async getUsers() {
    return this.userService.getUsers();
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Delete a user' })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden: Only admins can delete user',
  })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Car deleted' })
  @ApiParam({
    name: 'id',
    example: 'a3b1c2d3-e456-7890-abcd-1234567890ab',
    description: 'User ID (UUID format)',
  })
  async remove(
    @Param('id') id: string
  ): Promise<{ message: string; error: null }> {
    return this.userService.remove(id);
  }
}

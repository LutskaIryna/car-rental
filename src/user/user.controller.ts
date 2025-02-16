import { Controller, Post, Body, BadRequestException } from "@nestjs/common";
import { UserService } from "./user.service";
import {
  ApiOperation,
  ApiBody,
  ApiBearerAuth,
  ApiTags,
  ApiResponse,
} from "@nestjs/swagger";
import { RegisterDTO } from "./dto/register.dto";
import { Role } from "./roles/roles.enum";

@ApiBearerAuth()
@ApiTags("auth")
@Controller("auth")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post("register")
  @ApiOperation({ summary: "Register a new user" })
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
  async register(@Body() body: RegisterDTO ) {
    const { email, password } = body;

    if (!email || !password) {
      throw new BadRequestException("Email and password are required");
    }
    return this.userService.register(email, password, Role.USER);
  }

  @Post('/register-super-admin') // it is not neccessary to have this endpoint in swwager
  // @UseGuards(RolesGuard)
  // @Roles(Role.SUPER_ADMIN)
  async createSuperAdmin(@Body() { email, password }: { email: string; password: string }) {
    return this.userService.registerAdmin(email, password, Role.SUPER_ADMIN);
  }

  @Post('/register-role')
  // @UseGuards(RolesGuard)
  // @Roles(Role.SUPER_ADMIN)
  @ApiOperation({ summary: "Register a new user with role" })
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        email: { type: "string", example: "user@example.com" },
        password: { type: "string", example: "password123" },
        role: { type: "string", example: "User" },
      },
      required: ["email", "password"],
    },
  })
  @ApiResponse({ status: 403, description: "Forbidden." })
  async createUserWithRole(@Body() { email, password, role }: { email: string; password: string; role: Role }) {
    
    if(role === Role.SUPER_ADMIN || !Object.values(Role).includes(role)) {
      throw new BadRequestException("Invalid role");
    }
    return this.userService.register(email, password, role);
  }
}

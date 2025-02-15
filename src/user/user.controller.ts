import { Controller, Post, Body, BadRequestException } from "@nestjs/common";
import { UserService } from "./user.service";
import {
  ApiOperation,
  ApiBody,
  ApiBearerAuth,
  ApiTags,
  ApiResponse,
} from "@nestjs/swagger";

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
  async register(@Body() body: { email: string; password: string }) {
    const { email, password } = body;

    if (!email || !password) {
      throw new BadRequestException("Email and password are required");
    }

    return this.userService.register(email, password);
  }
}

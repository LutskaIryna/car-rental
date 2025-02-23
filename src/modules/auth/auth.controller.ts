import { Controller, Post, UseGuards, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService, IUser } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Public } from './public.decorator';


@ApiBearerAuth()
@ApiTags("auth")
@Controller("auth")
export class AuthController {

  constructor(private authService: AuthService){}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @Public()
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
  async login(@Request() req: {user: IUser}) {
    console.log(req.user)
    return this.authService.login(req.user);
  }

  
  // @UseGuards(LocalAuthGuard)
  @Post('logout')
  @Public()
  @ApiOperation({ summary: "Logout user" })
  // eslint-disable-next-line @typescript-eslint/require-await
  async logout(@Request() req: { logout: () => void }) {
    return req.logout();
  }

}
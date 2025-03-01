import { Controller, Get, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";


@Controller("profile")
export class ProfileController {

  @Get()
  @UseGuards(JwtAuthGuard)
  getProfile() {
    return 'Profile'
  }
}

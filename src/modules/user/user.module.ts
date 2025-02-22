import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { PasswordService } from "src/shared/security/password.service";
import { AuthService } from "src/modules/auth/auth.service";
import { JwtService } from "@nestjs/jwt";
import { JwtStrategy } from "../auth/strategy/jwt.strategy";

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService, PasswordService, AuthService, JwtService, JwtStrategy,
   ],
  exports: [UserService]
})
export class UserModule {}

import { Module } from '@nestjs/common';
import { AuthService } from "./services/auth.service";
import { JwtModule } from '@nestjs/jwt';
import {  ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './controllers/auth.controller';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { PasswordService } from './services/password.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from "./entities/user.entity";


@Module({
  imports: [ 
    JwtModule.registerAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => ({
            secret: configService.get<string>('JWT_SECRET'),
            signOptions: { expiresIn: configService.get<string>('EXPIRES_IN')},
          }),
        }),
    TypeOrmModule.forFeature([User])
  ],
  controllers: [AuthController, UserController],
  providers: [AuthService, UserService, PasswordService],
  exports: []
})

export class AuthModule {}
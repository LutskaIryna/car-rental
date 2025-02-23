import { Module } from '@nestjs/common';
import { AuthService } from "./auth.service";
import { UserModule } from "../user/user.module";
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import {  ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './strategy/local.strategy';


@Module({
  imports: [  
    UserModule, 
    PassportModule,
    JwtModule.registerAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => ({
            secret: configService.get<string>('JWT_SECRET'),
            signOptions: { expiresIn: '300h' },
          }),
        }),
    
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy],
  exports: [AuthService]
})

export class AuthModule {}
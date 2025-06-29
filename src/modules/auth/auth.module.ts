import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { PasswordService } from './services/password.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { RentalDataModule } from '../rental-data/rental-data.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), RentalDataModule],
  controllers: [AuthController, UserController],
  providers: [AuthService, UserService, PasswordService],
  exports: [],
})
export class AuthModule {}

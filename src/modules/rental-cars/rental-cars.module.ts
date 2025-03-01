import { Module } from '@nestjs/common';
import { RentalCarsController } from './controllers/rental-cars.controller';
import { RentalCarsService } from './services/rental-cars.service';
import { RentalCar } from './entities/rental-car.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

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
    TypeOrmModule.forFeature([RentalCar])
  ],
  controllers: [RentalCarsController],
  providers: [RentalCarsService]
})
export class RentalCarsModule {}

import { Module } from '@nestjs/common';
import { RentalDataController } from './controllers/rental-data.controller';
import { RentalDataService } from './services/rental-data.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RentalData } from './entity/rental-data.entity';
import { RentalCarsService } from '../rental-cars/services/rental-cars.service';
import { RentalCar } from '../rental-cars/entities/rental-car.entity';

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
      TypeOrmModule.forFeature([RentalData, RentalCar])
    ],
  controllers: [RentalDataController],
  providers: [RentalDataService, RentalCarsService]
})
export class RentalDataModule {

}

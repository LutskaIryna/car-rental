import { Module } from '@nestjs/common';
import { RentalDataController } from './controllers/rental-data.controller';
import { RentalDataService } from './services/rental-data.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RentalData } from './entity/rental-data.entity';
import { RentalCarsService } from '../rental-cars/services/rental-cars.service';
import { RentalCar } from '../rental-cars/entities/rental-car.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RentalData, RentalCar])],
  controllers: [RentalDataController],
  providers: [RentalDataService, RentalCarsService],
})
export class RentalDataModule {}

import { Module } from '@nestjs/common';
import { RentalDataController } from './controllers/rental-data.controller';
import { RentalDataService } from './services/rental-data.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RentalData } from './entity/rental-data.entity';
import { RentalCarsService } from '../rental-cars/services/rental-cars.service';
import { RentalCar } from '../rental-cars/entities/rental-car.entity';
import { Brand } from '../rental-cars/entities/brand.entity';
import { Model } from '../rental-cars/entities/model.entity';
import { RentalListener } from './services/rental-listener.service';

@Module({
  imports: [TypeOrmModule.forFeature([RentalData, RentalCar, Brand, Model])],
  controllers: [RentalDataController],
  providers: [RentalDataService, RentalCarsService, RentalListener],
  exports: [RentalDataService],
})
export class RentalDataModule {}

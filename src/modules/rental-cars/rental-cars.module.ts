import { Module } from '@nestjs/common';
import { RentalCarsController } from './controllers/rental-cars.controller';
import { RentalCarsService } from './services/rental-cars.service';
import { RentalCar } from './entities/rental-car.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RentalDataService } from '../rental-data/services/rental-data.service';
import { RentalData } from '../rental-data/entity/rental-data.entity';
import { Model } from './entities/model.entity';
import { Brand } from './entities/brand.entity';
import { BrandModelService } from './services/brand-model.service';
import { CarBrandsController } from './controllers/brand.controller';
import { CarModelsController } from './controllers/model.controller';

@Module({
  imports: [TypeOrmModule.forFeature([RentalCar, RentalData, Model, Brand])],
  controllers: [RentalCarsController, CarModelsController, CarBrandsController],
  providers: [RentalCarsService, RentalDataService, BrandModelService],
})
export class RentalCarsModule {}

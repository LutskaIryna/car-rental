import { Module } from '@nestjs/common';
import { RentalCarsController } from './controllers/rental-cars.controller';
import { RentalCarsService } from './services/rental-cars.service';
import { RentalCar } from './entities/rental-car.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([RentalCar])],
  controllers: [RentalCarsController],
  providers: [RentalCarsService],
})
export class RentalCarsModule {}

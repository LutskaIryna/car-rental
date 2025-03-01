import { Module } from '@nestjs/common';
import { RentalCarsController } from './controllers/rental-cars.controller';
import { RentalCarsService } from './services/rental-cars.service';

@Module({
  controllers: [RentalCarsController],
  providers: [RentalCarsService]
})
export class RentalCarsModule {}

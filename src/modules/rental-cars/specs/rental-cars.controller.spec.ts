import { Test, TestingModule } from '@nestjs/testing';
import { RentalCarsController } from './rental-cars.controller';

describe('RentalCarsController', () => {
  let controller: RentalCarsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RentalCarsController],
    }).compile();

    controller = module.get<RentalCarsController>(RentalCarsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

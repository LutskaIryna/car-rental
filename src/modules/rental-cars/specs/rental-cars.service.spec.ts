import { Test, TestingModule } from '@nestjs/testing';
import { RentalCarsService } from './rental-cars.service';

describe('RentalCarsService', () => {
  let service: RentalCarsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RentalCarsService],
    }).compile();

    service = module.get<RentalCarsService>(RentalCarsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

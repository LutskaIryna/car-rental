import { Test, TestingModule } from '@nestjs/testing';
import { RentalDataService } from '../services/rental-data.service';

describe('RentalDataService', () => {
  let service: RentalDataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RentalDataService],
    }).compile();


    service = module.get<RentalDataService>(RentalDataService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

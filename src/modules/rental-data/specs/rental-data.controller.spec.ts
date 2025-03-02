import { Test, TestingModule } from '@nestjs/testing';
import { RentalDataController } from '../controllers/rental-data.controller';

describe('RentalDataController', () => {
  let controller: RentalDataController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RentalDataController],
    }).compile();

    controller = module.get<RentalDataController>(RentalDataController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

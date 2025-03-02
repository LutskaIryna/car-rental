import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { RentalDataDto } from '../dto/rental-data.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { RentalData } from '../entity/rental-data.entity';
import { Repository } from 'typeorm';
import { RentalCar } from 'src/modules/rental-cars/entities/rental-car.entity';

@Injectable()
export class RentalDataService {

  constructor(
    @InjectRepository(RentalData)
    private rentalRepository: Repository<RentalData>,

    @InjectRepository(RentalCar)
    private carRepository: Repository<RentalCar>,
  ) {}

  async createRental(dto: RentalDataDto): Promise<RentalData> {
    const car = await this.carRepository.findOne({ where: { id: dto.carId } });
    
    if (!car) throw new NotFoundException('Car not found');

    const existingUserRental = await this.rentalRepository.findOne({
      where: { userId: dto.userId, isActive: true },
    });
  
    if (existingUserRental) {
      throw new ConflictException('User already has an active rental with another car.');
    }

    const existingCarRental = await this.rentalRepository.findOne({
      where: { carId: dto.carId, isActive: true },
    });
  
    if (existingCarRental) {
      throw new ConflictException('Car is already rented by another user.');
    }

    const rental = this.rentalRepository.create(dto);
    return this.rentalRepository.save(rental);
  }
}

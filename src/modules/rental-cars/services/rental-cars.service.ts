import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RentalCar } from '../entities/rental-car.entity';
import { CreateCarDto, UpdateCarDto } from '../dto/car.dto';

@Injectable()
export class RentalCarsService {

  constructor(
    @InjectRepository(RentalCar)
    private carRepository: Repository<RentalCar>,
  ) {}

  async create(createCarDto: CreateCarDto): Promise<RentalCar> {
    try {
      const car = this.carRepository.create(createCarDto);
      return await this.carRepository.save(car);
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (error.code === '23505') { // 23505 is the unique violation error code in PostgreSQL
        throw new ConflictException('A car with this VIN or Plate Number already exists.');
      }
      throw error;
    }
  }

  async update(id: string, updateCarDto: UpdateCarDto): Promise<RentalCar> {
    const car = await this.findOne(id);
    Object.assign(car, updateCarDto);
    return this.carRepository.save(car);
  }

  async remove(id: string): Promise<string> {
    console.log({id})
    const result = await this.carRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Car with id ${id} not found`);
    }
    return 'Car deleted'
  }

  async findAll(): Promise<RentalCar[]> {
    return this.carRepository.find();
  }

  async findOne(id: string): Promise<RentalCar> {
    const car = await this.carRepository.findOne({ where: { id } });
    if (!car) throw new NotFoundException(`Car with id ${id} not found`);
    return car;
  }
}

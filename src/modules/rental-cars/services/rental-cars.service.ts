import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RentalCar } from '../entities/rental-car.entity';
import { CreateCarDto, UpdateCarDto } from '../dto/car.dto';

@Injectable()
export class RentalCarsService {
  constructor(
    @InjectRepository(RentalCar)
    private carRepository: Repository<RentalCar>
  ) {}

  async create(createCarDto: CreateCarDto): Promise<RentalCar> {
    const car = this.carRepository.create(createCarDto);
    return await this.carRepository.save(car);
  }

  async update(id: string, updateCarDto: UpdateCarDto): Promise<RentalCar> {
    const car = await this.findOne(id);
    this.carRepository.merge(car, updateCarDto);
    return this.carRepository.save(car);
  }

  async remove(id: string): Promise<{ message: string; error: null }> {
    const result = await this.carRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Car with id ${id} not found`);
    }
    return { message: 'Car deleted', error: null };
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

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RentalCar } from '../entities/rental-car.entity';
import {
  CreateCarDto,
  RentalCarResponseDto,
  UpdateCarDto,
} from '../dto/car.dto';
import { Brand } from '../entities/brand.entity';
import { Model } from '../entities/model.entity';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class RentalCarsService {
  constructor(
    @InjectRepository(RentalCar)
    private carRepository: Repository<RentalCar>,
    @InjectRepository(Brand)
    private readonly brandRepository: Repository<Brand>,

    @InjectRepository(Model)
    private readonly modelRepository: Repository<Model>
  ) {}

  async create(createCarDto: CreateCarDto): Promise<RentalCar> {
    const { brandId, modelId, ...rest } = createCarDto;

    const brand = plainToInstance(Brand, { id: brandId });
    const model = plainToInstance(Model, { id: modelId });
    const car = this.carRepository.create({ ...rest });
    car.brand = brand;
    car.model = model;
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

  async findAll(): Promise<RentalCarResponseDto[]> {
    const cars = await this.carRepository
      .createQueryBuilder('car')
      .leftJoinAndSelect('car.brand', 'brands')
      .leftJoinAndSelect('car.model', 'models')
      .getMany();

    return plainToInstance(RentalCarResponseDto, cars);
  }

  async findOne(id: string): Promise<RentalCar> {
    const car = await this.carRepository.findOne({ where: { id } });
    if (!car) throw new NotFoundException(`Car with id ${id} not found`);
    return car;
  }
}

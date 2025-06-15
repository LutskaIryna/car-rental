import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  RentalDataDto,
  RentalDataResponseDto,
  UpdateRentalDto,
} from '../dto/rental-data.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { RentalData } from '../entity/rental-data.entity';
import { RentalCar } from 'src/modules/rental-cars/entities/rental-car.entity';
import { Repository } from 'typeorm';
import { RentalCarResponseDto } from 'src/modules/rental-cars/dto/car.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class RentalDataService {
  constructor(
    @InjectRepository(RentalData)
    private rentalRepository: Repository<RentalData>,

    @InjectRepository(RentalCar)
    private carRepository: Repository<RentalCar>
  ) {}

  async createRental(dto: RentalDataDto): Promise<RentalDataResponseDto> {
    const car = await this.carRepository.findOne({ where: { id: dto.carId } });

    if (!car) throw new NotFoundException('Car not found');

    const existingUserRental = await this.rentalRepository.findOne({
      where: { userId: dto.userId, isActive: true },
    });

    if (existingUserRental) {
      throw new ConflictException(
        'User already has an active rental with another car.'
      );
    }

    const existingCarRental = await this.rentalRepository.findOne({
      where: { carId: dto.carId, isActive: true },
    });

    if (existingCarRental) {
      throw new ConflictException('Car is already rented by another user.');
    }

    const rental = this.rentalRepository.create(dto);
    const saved = await this.rentalRepository.save(rental);
    const result = await this.rentalRepository
      .createQueryBuilder('rental')
      .leftJoinAndSelect('rental.car', 'car')
      .leftJoinAndSelect('car.brand', 'brand')
      .leftJoinAndSelect('car.model', 'model')
      .where('rental.id = :id', { id: saved.id })
      .getOne();

    if (!result) {
      throw new NotFoundException('Rental not found after creation');
    }
    return plainToInstance(RentalDataResponseDto, result);
  }

  async updateRental(
    rentalId: string,
    userId: string,
    dto: UpdateRentalDto
  ): Promise<RentalData> {
    const rental = await this.rentalRepository.findOne({
      where: { id: rentalId },
    });

    if (!rental) {
      throw new NotFoundException(`Rental with ID ${rentalId} not found`);
    }

    if (rental.userId !== userId) {
      throw new ForbiddenException('You can only update your own rentals');
    }
    this.rentalRepository.merge(rental, dto);
    return this.rentalRepository.save(rental);
  }

  async getFilteredCars(
    isAvailableCars: boolean,
    filters: Partial<RentalCar> & { query?: string } = {}
  ): Promise<RentalCarResponseDto[]> {
    const rentedCars = await this.rentalRepository.find({
      where: { isActive: true },
      select: ['carId'],
    });
    const carIds = rentedCars.map((rental) => rental.carId);

    const qb = this.carRepository
      .createQueryBuilder('car')
      .leftJoinAndSelect('car.brand', 'brands')
      .leftJoinAndSelect('car.model', 'models');

    if (isAvailableCars) {
      qb.where('car.id NOT IN (:...carIds)', {
        carIds: carIds.length
          ? carIds
          : ['00000000-0000-0000-0000-000000000000'],
      });
    } else {
      qb.where('car.id IN (:...carIds)', { carIds });
    }

    const { query, ...restFilters } = filters;

    Object.entries(restFilters).forEach(([key, value]) => {
      if (!value) return;

      if (typeof value !== 'string') {
        throw new BadRequestException(`Filter "${key}" must be a string`);
      }

      if (key === 'brandId') {
        qb.andWhere('brands.id = :brandId', { brandId: value });
      } else if (key === 'modelId') {
        qb.andWhere('models.id = :modelId', { modelId: value });
      } else {
        qb.andWhere(`car.${key} ILIKE :${key}`, {
          [key]: `%${value}%`,
        });
      }
    });

    qb.andWhere(`(brands.name ILIKE :query OR models.name ILIKE :query)`, {
      query: `%${query || ''}%`,
    });

    return qb.getMany();
  }

  async getActiveRentalByUser(userId: string): Promise<RentalData[]> {
    return this.rentalRepository
      .createQueryBuilder('rental')
      .leftJoinAndSelect('rental.car', 'car')
      .leftJoinAndSelect('car.brand', 'brand')
      .leftJoinAndSelect('car.model', 'model')
      .where('rental.userId = :userId', { userId })
      .andWhere('rental.isActive = true')
      .getMany();
  }
}

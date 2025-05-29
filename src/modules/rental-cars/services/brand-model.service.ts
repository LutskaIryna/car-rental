import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Brand } from '../entities/brand.entity';
import { Model } from '../entities/model.entity';

@Injectable()
export class BrandModelService {
  constructor(
    @InjectRepository(Brand)
    private readonly brandRepository: Repository<Brand>,

    @InjectRepository(Model)
    private readonly modelRepository: Repository<Model>
  ) {}

  async findAllBrands(): Promise<Brand[]> {
    return this.brandRepository.find();
  }

  async findAllModelsByBrandId(brandId: string): Promise<Model[]> {
    return this.modelRepository.find({
      where: { brandId },
    });
  }

  async findAllModels(): Promise<Model[]> {
    return this.modelRepository.find();
  }
}

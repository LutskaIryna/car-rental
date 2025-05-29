import { Controller, Get, UseGuards, HttpStatus, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiResponse, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { Model } from '../entities/model.entity';
import { BrandModelService } from '../services/brand-model.service';

@ApiBearerAuth()
@ApiTags('car-model')
@Controller('car-model')
export class CarModelsController {
  constructor(private readonly brandModelService: BrandModelService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of  models',
    type: [Model],
  })
  async getModels() {
    return this.brandModelService.findAllModels();
  }

  @Get(':brandId')
  @UseGuards(JwtAuthGuard)
  @ApiParam({
    name: 'brandId',
    example: 'a3b1c2d3-e456-7890-abcd-1234567890ab',
    description: 'Brand ID (UUID format)',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of models by brand id',
    type: [Model],
  })
  async getModelsByBrandId(@Param('brandId') id: string) {
    return this.brandModelService.findAllModelsByBrandId(id);
  }
}

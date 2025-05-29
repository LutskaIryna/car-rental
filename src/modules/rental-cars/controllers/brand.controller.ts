import { Controller, Get, HttpStatus, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { BrandModelService } from '../services/brand-model.service';
import { Model } from '../entities/model.entity';
import { Brand } from '../entities/brand.entity';

@ApiBearerAuth()
@ApiTags('car-brand')
@Controller('car-brand')
export class CarBrandsController {
  constructor(private readonly brandModelService: BrandModelService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of  brands',
    type: [Brand],
  })
  async getBrands() {
    return this.brandModelService.findAllBrands();
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

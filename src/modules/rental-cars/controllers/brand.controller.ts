import { Controller, Get, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { BrandModelService } from '../services/brand-model.service';
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
}

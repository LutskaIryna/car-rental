import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { RentalDataService } from '../services/rental-data.service';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/modules/auth/guards/roles.guard';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { Roles } from 'src/modules/auth/decorators/roles.decorator';
import { Role } from 'src/modules/auth/enums/roles.enum';
import { RentalDataDto, UpdateRentalDto } from '../dto/rental-data.dto';
import { RentalData } from '../entity/rental-data.entity';
import { Request } from 'express';
import { RentalCar } from 'src/modules/rental-cars/entities/rental-car.entity';

@Controller('rental')
export class RentalDataController {
  constructor(private readonly rentalService: RentalDataService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.USER)
  @ApiOperation({ summary: 'Create a new rental' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Rental created',
    type: RentalData,
  })
  async createRental(
    @Body() dto: Omit<RentalDataDto, 'userId'>,
    @Req() req: Request & { user?: { id: string } }
  ): Promise<RentalData> {
    const userId = req.user?.id || '';

    return this.rentalService.createRental({ ...dto, userId });
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update an existing rental' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Rental updated',
    type: RentalData,
  })
  async updateRental(
    @Param('id') rentalId: string,
    @Body() dto: UpdateRentalDto,
    @Req() req: Request & { user?: { id: string } }
  ): Promise<RentalData> {
    const userId = req.user?.id || '';

    return this.rentalService.updateRental(rentalId, userId, dto);
  }

  @Get('/rented')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get all rented cars (Admin only)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of rented cars',
    type: [RentalData],
  })
  async getAllRentedCars(): Promise<RentalCar[]> {
    return this.rentalService.getFilteredCars(false);
  }

  @Get('/available')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.USER)
  @ApiOperation({ summary: 'Get all available cars' })
  @ApiQuery({ name: 'vin', required: false, type: String })
  @ApiQuery({ name: 'brend', required: false, type: String })
  @ApiQuery({ name: 'model', required: false, type: String })
  @ApiQuery({ name: 'color', required: false, type: String })
  @ApiQuery({ name: 'plateNumber', required: false, type: String })
  @ApiQuery({ name: 'year', required: false, type: String })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of available cars',
    type: [RentalData],
  })
  async getAllAvailableCars(
    @Query() queryParams: Partial<RentalCar>
  ): Promise<RentalCar[]> {
    return this.rentalService.getFilteredCars(true, queryParams);
  }
}

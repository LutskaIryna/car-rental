import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from 'src/modules/auth/decorators/roles.decorator';
import { Role } from 'src/modules/auth/enums/roles.enum';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/modules/auth/guards/roles.guard';
import { CreateCarDto, RentalCarResponseDto } from '../dto/car.dto';
import { RentalCar } from '../entities/rental-car.entity';
import { RentalCarsService } from '../services/rental-cars.service';
import { RentalDataService } from 'src/modules/rental-data/services/rental-data.service';
import { RentalStateOfCar } from '../enums/enums';
import { Request } from 'express';

@ApiBearerAuth()
@ApiTags('rental-cars')
@Controller('rental-cars')
export class RentalCarsController {
  constructor(
    private readonly carService: RentalCarsService,
    private readonly rentalService: RentalDataService
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Create a new car' })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden: Only admins can create cars',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Car created',
    type: RentalCar,
  })
  async create(@Body() createCarDto: CreateCarDto): Promise<RentalCar> {
    return this.carService.create(createCarDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Delete a car' })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden: Only admins can delete cars',
  })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Car deleted' })
  @ApiParam({
    name: 'id',
    example: 'a3b1c2d3-e456-7890-abcd-1234567890ab',
    description: 'Car ID (UUID format)',
  })
  async remove(
    @Param('id') id: string
  ): Promise<{ message: string; error: null }> {
    return this.carService.remove(id);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Get cars with optional filter (available/rented/all)',
  })
  @ApiQuery({
    name: 'filter',
    enum: [
      RentalStateOfCar.AVAILABLE,
      RentalStateOfCar.RENTED,
      RentalStateOfCar.ALL,
    ],
    required: false,
  })
  @ApiQuery({ name: 'vin', required: false, type: String })
  @ApiQuery({ name: 'brand', required: false, type: String })
  @ApiQuery({ name: 'model', required: false, type: String })
  @ApiQuery({ name: 'color', required: false, type: String })
  @ApiQuery({ name: 'plateNumber', required: false, type: String })
  @ApiQuery({ name: 'year', required: false, type: String })
  @ApiQuery({ name: 'query', required: false, type: String })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of filtered cars',
    type: [RentalCarResponseDto],
  })
  async getCars(
    @Query('filter') filter: RentalStateOfCar = RentalStateOfCar.AVAILABLE,
    @Query() queryParams: Partial<RentalCar>,
    @Req() req: Request & { user?: { id: string; role: Role } }
  ): Promise<RentalCarResponseDto[]> {
    const role = req.user?.role || '';
    const isAdmin = role === Role.ADMIN || role === Role.SUPER_ADMIN;

    if (
      (filter === RentalStateOfCar.ALL || filter === RentalStateOfCar.RENTED) &&
      !isAdmin
    ) {
      throw new ForbiddenException('Only admins can access this data');
    }

    if (filter === RentalStateOfCar.ALL) {
      return this.carService.findAll();
    }

    delete queryParams['filter'];

    const isAvailable = filter === RentalStateOfCar.AVAILABLE;
    return this.rentalService.getFilteredCars(isAvailable, queryParams);
  }
}

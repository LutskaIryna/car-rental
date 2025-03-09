import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from 'src/modules/auth/decorators/roles.decorator';
import { Role } from 'src/modules/auth/enums/roles.enum';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/modules/auth/guards/roles.guard';
import { CreateCarDto } from '../dto/car.dto';
import { RentalCar } from '../entities/rental-car.entity';
import { RentalCarsService } from '../services/rental-cars.service';

@ApiBearerAuth()
@ApiTags('rental-cars')
@Controller('rental-cars')
export class RentalCarsController {
  constructor(private readonly carService: RentalCarsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
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
  @Roles(Role.ADMIN)
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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get all cars' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of all cars',
    type: [RentalCar],
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden: Only admins can access this',
  })
  async findAll(): Promise<RentalCar[]> {
    return this.carService.findAll();
  }
}

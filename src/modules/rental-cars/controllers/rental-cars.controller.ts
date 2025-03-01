import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/modules/auth/decorators/roles.decorator';
import { Role } from 'src/modules/auth/enums/roles.enum';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/modules/auth/guards/roles.guard';
import { CreateCarDto } from '../dto/car.dto';
import { RentalCar } from '../entities/rental-car.entity';
import { RentalCarsService } from '../services/rental-cars.service';

@ApiBearerAuth()
@ApiTags("rental-cars")
@Controller('rental-cars')
export class RentalCarsController {

  constructor(private readonly carService: RentalCarsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Create a new car' })
  @ApiBody({
      schema: {
        type: "object",
        properties: {
          vin: { type: "string",  example: "1HGCM5526A262224"},
          model: { type: "string", example: "Skoda" },
          color: { type: "string", example: "Red" },
          plateNumber: { type: "string", example: "AA5656BH" },
          year: { type: "string", example: "2025" },
        },
        required: ["vin", "model", "color", "plateNumber", "year"],
      },
    })
  @ApiResponse({ status: 403, description: 'Forbidden: Only admins can create cars' })
  @ApiResponse({ status: 201, description: 'Car created', type: RentalCar })
  create(@Body() createCarDto: CreateCarDto): Promise<RentalCar> {
    return this.carService.create(createCarDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Delete a car' })
  @ApiResponse({ status: 403, description: 'Forbidden: Only admins can delete cars' })
  @ApiResponse({ status: 204, description: 'Car deleted' })
  @ApiParam({ name: 'id', example: 'a3b1c2d3-e456-7890-abcd-1234567890ab', description: 'Car ID (UUID format)' })
  remove(@Param('id') id: string): Promise<string> {
    return this.carService.remove(id);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get all cars' })
  @ApiResponse({ status: 200, description: 'List of all cars', type: [RentalCar] })
  @ApiResponse({ status: 403, description: 'Forbidden: Only admins can access this' })
  findAll(): Promise<RentalCar[]> {
    return this.carService.findAll();
  }
}

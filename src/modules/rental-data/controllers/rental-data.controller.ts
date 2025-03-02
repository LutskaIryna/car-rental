import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { RentalDataService } from '../services/rental-data.service';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/modules/auth/guards/roles.guard';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Roles } from 'src/modules/auth/decorators/roles.decorator';
import { Role } from 'src/modules/auth/enums/roles.enum';
import { RentalDataDto } from '../dto/rental-data.dto';
import { RentalData } from '../entity/rental-data.entity';
import { Request } from 'express';

@Controller('rental')
export class RentalDataController {
  constructor(private readonly rentalService: RentalDataService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.USER)
  @ApiOperation({ summary: 'Create a new rental' })
  @ApiResponse({ status: 201, description: 'Rental created', type: RentalData })
  createRental(@Body() dto: Omit<RentalDataDto, 'userId'>, @Req() req: Request & { user?: { id: string } }): Promise<RentalData> {
    const userId = req.user?.id || ''; 

    return this.rentalService.createRental({ ...dto, userId });
  }
}

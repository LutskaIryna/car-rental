import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class RentalDataDto {
  @ApiProperty({ example: '1HGCM-5526560-26A262-224' })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ example: '1HGCM-5526560-26A262-224' })
  @IsString()
  @IsNotEmpty()
  carId: string;

  @ApiProperty({ example: '' })
  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @ApiProperty({ example: '' })
  @IsDateString()
  @IsNotEmpty()
  endDate: string;

  @ApiProperty({ example: 'true' })
  @IsBoolean()
  IsActive: boolean;
}

export class UpdateRentalDto extends PartialType(RentalDataDto) {
  @ApiProperty({ example: '2024-03-15T18:00:00Z', required: false })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiProperty({ example: '2024-03-15T18:00:00Z', required: false })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';
import { Brand } from '../entities/brand.entity';
import { Model } from '../entities/model.entity';

export class CreateCarDto {
  @ApiProperty({ example: '1HGCM5526A262224' })
  @IsString()
  @IsNotEmpty()
  vin: string;

  @ApiProperty({ example: '51254093-4bf9-45a1-980a-d69822ffb0ce' })
  @IsString()
  @IsNotEmpty()
  brandId: string;

  @ApiProperty({ example: '51254093-4bf9-45a1-980a-d69822ffb0ce' })
  @IsString()
  @IsNotEmpty()
  modelId: string;

  @ApiProperty({ example: 'red' })
  @IsString()
  @IsNotEmpty()
  color: string;

  @ApiProperty({ example: 'AA5656BH' })
  @IsString()
  @IsNotEmpty()
  plateNumber: string;

  @ApiProperty({ example: '2025' })
  @IsNotEmpty()
  year: string;
}

export class UpdateCarDto extends CreateCarDto {}

export class RentalCarResponseDto {
  id: string;
  vin: string;
  color: string;
  plateNumber: string;
  year: string;
  brand: Brand;
  model: Model;
}

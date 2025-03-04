/* eslint-disable @typescript-eslint/no-unsafe-call */
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateCarDto {
  @ApiProperty({ example: '1HGCM5526A262224' })
  @IsString()
  @IsNotEmpty()
  vin: string;

  @ApiProperty({ example: 'Skoda' })
  @IsString()
  @IsNotEmpty()
  model: string;

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

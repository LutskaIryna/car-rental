import { ApiProperty } from "@nestjs/swagger";

export class CreateCarDto {
  @ApiProperty({ example: "1HGCM5526A262224" })
  vin: string;

  @ApiProperty({ example: "Skoda" })
  model: string;

  @ApiProperty({ example: "red" })
  color: string;

  @ApiProperty({ example: "AA5656BH" })
  plateNumber: string;

  @ApiProperty({ example: "2025" })
  year: string;
}

export class UpdateCarDto extends CreateCarDto {}
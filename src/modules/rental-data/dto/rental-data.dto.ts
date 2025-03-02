import { ApiProperty } from "@nestjs/swagger";

export class RentalDataDto {
  @ApiProperty({ example: "1HGCM-5526560-26A262-224" })
  userId: string;

  @ApiProperty({ example: "1HGCM-5526560-26A262-224" })
  carId: string;

  @ApiProperty({ example: "" })
  startDate: string;

  @ApiProperty({ example: "" })
  endDate: string;

  @ApiProperty({ example: "true" })
  paid: boolean;
}
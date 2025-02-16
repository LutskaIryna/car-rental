import { ApiProperty } from "@nestjs/swagger";

export class RegisterDTO {
  @ApiProperty({ example: "user@example.com" })
  email: string;

  @ApiProperty({ example: "password123" })
  password: string;
}

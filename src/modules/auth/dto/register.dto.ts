import { ApiProperty } from "@nestjs/swagger";
import { Role } from "../enums/roles.enum";

export class RegisterDTO {
  @ApiProperty({ example: "user@example.com" })
  email: string;

  @ApiProperty({ example: "password123" })
  password: string;

  @ApiProperty({ example: "user" })
  role: Role;
}

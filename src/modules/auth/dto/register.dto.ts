import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../enums/roles.enum';
import { IsString, IsEmail, MinLength, IsOptional } from 'class-validator';

export class RegisterDTO {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'user' })
  @IsOptional()
  @IsString()
  role: Role;
}

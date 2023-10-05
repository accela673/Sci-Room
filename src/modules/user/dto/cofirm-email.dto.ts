import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class ConfirmEmailDto {
  @ApiProperty({ example: 'sardarkasmaliev@gmail.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '2nd5o7' })
  @IsString()
  @MinLength(6)
  @MaxLength(6) // Минимальная длина пароля
  code: string;
}

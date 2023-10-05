import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';
import { BaseDto } from 'src/base/dto/base.dto.';

export class LoginDto extends BaseDto {
  @ApiProperty({ example: 'sardarkasmaliev@gmail.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'your_password' })
  @IsString()
  @MinLength(6) // Минимальная длина пароля
  password: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { MaxLength, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({
    example: 'NewPass123',
    description: 'New password',
  })
  @MaxLength(25)
  @MinLength(6)
  newPassword: string;
}

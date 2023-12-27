import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AddCommentDto {
  @ApiProperty({ example: 'My comment' })
  @IsNotEmpty()
  @IsString()
  text: string;
}

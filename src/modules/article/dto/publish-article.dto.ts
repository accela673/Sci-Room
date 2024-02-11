import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class PublishArticleDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  articleId: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  editionNumber: number;
}

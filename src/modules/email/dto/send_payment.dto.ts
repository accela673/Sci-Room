import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class SendPaymentDto {
  @IsNotEmpty()
  articleId: number;

  @IsOptional()
  file: Express.Multer.File;
}

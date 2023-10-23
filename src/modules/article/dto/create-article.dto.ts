import { IsOptional, IsString } from 'class-validator';

export class CreateArticleDto {
  @IsOptional()
  image: null | Express.Multer.File;

  // @IsOptional()
  // pdfFile: null | Express.Multer.File;

  // @IsOptional()
  // txtFile: null | Express.Multer.File;

  @IsString()
  title: string;

  @IsString()
  text: string;
}

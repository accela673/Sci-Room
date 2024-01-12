import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateArticleDto {
  @IsOptional()
  file: Express.Multer.File;

  @IsNotEmpty()
  @IsOptional()
  coauthors: null | string;
  // @IsOptional()
  // pdfFile: null | Express.Multer.File;

  // @IsOptional()
  // txtFile: null | Express.Multer.File;

  @IsNotEmpty()
  @IsString()
  category: string;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  text: string;
}

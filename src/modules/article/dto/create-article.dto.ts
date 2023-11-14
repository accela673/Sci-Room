import { IsOptional, IsString } from 'class-validator';

export class CreateArticleDto {
  @IsOptional()
  file: null | Express.Multer.File;

  @IsOptional()
  coauthors: null | string[];
  // @IsOptional()
  // pdfFile: null | Express.Multer.File;

  // @IsOptional()
  // txtFile: null | Express.Multer.File;

  @IsString()
  title: string;

  @IsString()
  text: string;
}

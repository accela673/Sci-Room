import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateArticleDto {
  @IsOptional()
  checkFile: Express.Multer.File;

  @IsOptional()
  articleFile: Express.Multer.File;

  @IsNotEmpty()
  @IsOptional()
  coauthors: null | string;

  @IsNotEmpty()
  @IsOptional()
  coauthorsEmails: null | string;

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

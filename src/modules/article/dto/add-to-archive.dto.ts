import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class AddToArchiveDto {
  @IsOptional()
  articleFile: Express.Multer.File;

  @IsOptional()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsOptional()
  coauthors: null | string;

  @IsNotEmpty()
  @IsOptional()
  coauthorsEmails: null | string;

  @IsNotEmpty()
  @IsString()
  categoryName: string;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  text: string;

  @IsNotEmpty()
  @IsString()
  yearString: string;

  @IsNotEmpty()
  @IsString()
  volumeString: string;

  @IsNotEmpty()
  @IsString()
  editionString: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UploadFilesDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  @IsNotEmpty()
  checkFile: any; // Используйте тип, который соответствует вашему DTO

  @ApiProperty({ type: 'string', format: 'binary' })
  @IsNotEmpty()
  articleFile: any; // Используйте тип, который соответствует вашему DTO
}

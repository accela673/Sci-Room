import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileService } from './file.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('File upload')
@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('image')
  @ApiOperation({ summary: 'For uploading images' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('image'))
  createImage(@UploadedFile() file: Express.Multer.File) {
    return this.fileService.createImage(file);
  }

  @Post('pdf')
  @ApiOperation({ summary: 'For uploading pdf' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        pdfFile: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('pdfFile'))
  createpdf(@UploadedFile() file: Express.Multer.File) {
    return this.fileService.createPdf(file);
  }

  @Post('docx')
  @ApiOperation({ summary: 'For uploading docx (word file)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        docx: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('docx'))
  createTxt(@UploadedFile() file: Express.Multer.File) {
    return this.fileService.createDocx(file);
  }
}

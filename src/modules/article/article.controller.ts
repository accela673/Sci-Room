import {
  Body,
  Post,
  Req,
  Controller,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Get,
  Param,
  Patch,
  BadRequestException,
  UploadedFiles,
} from '@nestjs/common';
import {
  FileFieldsInterceptor,
  FileInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';
import { ArticleService } from './article.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CreateArticleDto } from './dto/create-article.dto';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { UserRole } from '../user/enums/roles.enum';
import { SendPaymentDto } from '../email/dto/send_payment.dto';
import * as pdfParse from 'pdf-parse';
import { UploadFilesDto } from './dto/upload-files.dto';

@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @ApiTags('Articles for user')
  @Get('allMy')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all my articles' })
  async getAllMyArticles(@Req() req: any) {
    return await this.articleService.getAllMy(req.user.id);
  }

  @ApiTags('Articles for user')
  @Get('allMyDeleted')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get my deleted articles' })
  async getAllMyDeletedArticles(@Req() req: any) {
    return await this.articleService.getAllMyDeleted(req.user.id);
  }

  @ApiTags('Articles for user')
  @Post('sendArticlePayment')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Send article payment file' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        articleId: { type: 'number' },
      },
    },
  })
  async sendPayment(
    @Req() req,
    @Body() sendPaymentDto: SendPaymentDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('File not found');
    }
    sendPaymentDto.file = file;
    return await this.articleService.sendPayment(sendPaymentDto, req.user.id);
  }

  @ApiTags('Articles for user')
  @Post('create')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create article' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'checkFile' }, { name: 'articleFile' }]),
  )
  async createArticle(
    @Req() req: any,
    @Body()
    createArticleDto: CreateArticleDto,
    @UploadedFiles()
    files: {
      checkFile: Express.Multer.File;
      articleFile: Express.Multer.File;
    },
  ) {
    const article = new CreateArticleDto();
    const checkFile = files.checkFile[0];
    const articleFile = files.articleFile[0];

    if (!checkFile || !articleFile) {
      throw new BadRequestException(
        'Both checkFile and articleFile are required',
      );
    }
    try {
      const data = await pdfParse(articleFile.buffer);
      article.checkFile = checkFile;
      article.articleFile = articleFile;
      Object.assign(article, createArticleDto);
      return await this.articleService.createArticle(
        req.user.id,
        article,
        data.numpages,
      );
    } catch (error) {
      throw new Error(`Error extracting text: ${error}`);
    }
  }

  @ApiTags('Articles for admin')
  @Get('all')
  @ApiOperation({ summary: 'Get all articles' })
  async getArticles() {
    return await this.articleService.getAll();
  }

  @ApiTags('Articles for admin')
  @Get('all/deleted') // Updated route to avoid conflict
  @ApiOperation({ summary: 'Get all deleted articles' })
  async getDeletedArticles() {
    return await this.articleService.getAllDeleted();
  }

  @ApiTags('Articles for admin')
  @Get('category/:categoryName')
  @ApiOperation({ summary: 'Get articles of a certain category' })
  async getCategoryArticles(@Param('categoryName') name: string) {
    return await this.articleService.getAllByCategory(name);
  }

  @ApiTags('Articles for admin')
  @Get('find/:id')
  @ApiOperation({ summary: 'Get article by id' })
  async getArticle(@Param('id') id: number) {
    return await this.articleService.getOne(+id);
  }

  @ApiTags('Articles for admin')
  @Patch('delete/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete article by id' })
  async deleteArticle(@Param('id') id: number, @Req() req) {
    if (req.user.role != UserRole.ADMIN) {
      throw new BadRequestException('Only admin has permission to this action');
    }
    return await this.articleService.deleteArticle(+id);
  }

  @ApiTags('Articles for admin')
  @Patch('restore/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Restore article by id' })
  async restoreArticle(@Param('id') id: number, @Req() req) {
    if (req.user.role != UserRole.ADMIN) {
      throw new BadRequestException('Only admin has permission to this action');
    }
    return await this.articleService.restoreArticle(+id);
  }

  @ApiTags('Articles for admin')
  @Patch('approve/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Approve article by id' })
  async approveArticle(@Param('id') id: number, @Req() req) {
    if (req.user.role != UserRole.ADMIN) {
      throw new BadRequestException('Only admin has permission to this action');
    }
    return await this.articleService.approveArticle(+id);
  }

  @ApiTags('Articles for admin')
  @Patch('changeVisibility/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Make article public or private' })
  async changeVisibility(@Param('id') id: number, @Req() req) {
    if (req.user.role != UserRole.ADMIN) {
      throw new BadRequestException('Only admin has permission to this action');
    }
    return await this.articleService.changeVisibility(+id);
  }

  @ApiTags('Articles for user')
  @Post('test/twofiles/upload')
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'checkFile' }, { name: 'articleFile' }]),
  ) // 2 - максимальное количество файлов
  async uploadFiles(
    @UploadedFiles()
    files: {
      checkFile: Express.Multer.File;
      articleFile: Express.Multer.File;
    },
  ) {
    const checkFile = files.checkFile[0];
    const articleFile = files.articleFile[0];

    if (!checkFile || !articleFile) {
      throw new BadRequestException(
        'Both checkFile and articleFile are required',
      );
    }
    console.log(checkFile);
  }
}

import {
  Body,
  Post,
  Req,
  Controller,
  UseInterceptors,
  UseGuards,
  Get,
  Param,
  BadRequestException,
  UploadedFiles,
  UploadedFile,
} from '@nestjs/common';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { ArticleService } from './article.service';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CreateArticleDto } from './dto/create-article.dto';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { UserRole } from '../user/enums/roles.enum';
import * as pdfParse from 'pdf-parse';
import { PublishArticleDto } from './dto/publish-article.dto';
import { AddToArchiveDto } from './dto/add-to-archive.dto';

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
  @Post('get/approved')
  @ApiOperation({ summary: 'Опубликовать статью указав выпуск' })
  async getAllApproved() {
    return await this.articleService.getAllApproved();
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
  @Post('delete/:id')
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
  @Post('restore/:id')
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
  @Post('approve/:id')
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
  @Post('decline/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Decline article by id' })
  async declineArticle(@Param('id') id: number, @Req() req) {
    if (req.user.role != UserRole.ADMIN) {
      throw new BadRequestException('Only admin has permission to this action');
    }
    return await this.articleService.declineArticle(+id);
  }

  @ApiTags('Articles for admin')
  @Post('publish/article')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Опубликовать статью указав выпуск' })
  async publishArticle(@Body() publishDto: PublishArticleDto, @Req() req) {
    if (req.user.role != UserRole.ADMIN) {
      throw new BadRequestException('Only admin has permission to this action');
    }
    return await this.articleService.publish(publishDto);
  }

  @ApiTags('Articles for admin')
  @Post('add/archive')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('articleFile'))
  @ApiOperation({ summary: 'Опубликовать статью в архив' })
  async addToArchive(
    @Body() Dto: AddToArchiveDto,
    @Req() req,
    @UploadedFile() articleFile: Express.Multer.File,
  ) {
    if (req.user.role != UserRole.ADMIN) {
      throw new BadRequestException('Only admin has permission to this action');
    }
    Dto.articleFile = articleFile;
    const data = await pdfParse(articleFile.buffer);
    return await this.articleService.addToArchive(Dto, data.numpages);
  }
}

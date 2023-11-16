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
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
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

@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @ApiTags('Articles for user')
  @Get('allMy')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get my articles' })
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
  @UseInterceptors(FileInterceptor('file'))
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        title: { type: 'string' },
        text: { type: 'string' },
        category: { type: 'string' },
        coauthors: { type: 'string', example: 'Ryan Gosling, Tyler Durden' },
      },
      required: ['title', 'text'],
    },
  })
  async createArticle(
    @Req() req: any,
    @Body()
    createArticleDto: CreateArticleDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const article = new CreateArticleDto();
    if (!file) {
      throw new BadRequestException('File not found');
    }
    article.file = file;
    Object.assign(article, createArticleDto);
    return await this.articleService.createArticle(req.user.id, article);
    // console.log(file);
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
  @ApiOperation({ summary: 'Delete article by id' })
  async deleteArticle(@Param('id') id: number) {
    return await this.articleService.deleteArticle(+id);
  }

  @ApiTags('Articles for admin')
  @Patch('restore/:id')
  @ApiOperation({ summary: 'Restore article by id' })
  async restoreArticle(@Param('id') id: number) {
    return await this.articleService.restoreArticle(+id);
  }
}

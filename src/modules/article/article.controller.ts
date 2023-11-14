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
  Delete,
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
  @Get('all')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get my articles' })
  async getAllMyArticles(@Req() req: any) {
    return await this.articleService.getAllMy(req.user.id);
  }

  @ApiTags('Articles for user')
  @Get('allDeleted')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get my deleted articles' })
  async getAllMyDeletedArticles(@Req() req: any) {
    return await this.articleService.getAllMy(req.user.id);
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
          nullable: true,
        },
        title: { type: 'string' },
        text: { type: 'string' },
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
    if (file) {
      article.file = file;
    }
    Object.assign(article, createArticleDto);
    return await this.articleService.createArticle(req.user.id, article);
    // console.log(file);
  }

  @ApiTags('Articles for admin')
  @Get(':id')
  @ApiOperation({ summary: 'Get article by id' })
  async getArticle(@Param('id') id: number) {
    return await this.articleService.getOne(+id);
  }

  @ApiTags('Articles for admin')
  @Delete(':id')
  @ApiOperation({ summary: 'Delete article by id' })
  async deleteArticle(@Param('id') id: number) {
    return await this.articleService.deleteArticle(+id);
  }
}

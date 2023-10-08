import {
  Body,
  Post,
  Req,
  Controller,
  UseInterceptors,
  UploadedFile,
  UseGuards,
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

@ApiTags('Articles')
@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post('create')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create article' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
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
      article.image = file;
    }
    Object.assign(article, createArticleDto);
    return await this.articleService.createArticle(req.user.id, article);
    // console.log(file);
  }
}

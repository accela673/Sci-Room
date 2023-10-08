import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/base/base.service';
import { ArticleEntity } from './entities/article.entity';
import { Repository } from 'typeorm';
import { CreateArticleDto } from './dto/create-article.dto';
import { UserService } from '../user/services/user.service';
import { ImageService } from '../image/image.service';

@Injectable()
export class ArticleService extends BaseService<ArticleEntity> {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,
    private userService: UserService,
    private imageService: ImageService,
  ) {
    super(articleRepository);
  }

  async createArticle(userId: number, createArticleDto: CreateArticleDto) {
    const article = new ArticleEntity();
    if (createArticleDto.image) {
      const image = await this.imageService.createImage(createArticleDto.image);
      article.imageUrl = image.url;
    }
    article.imageUrl = null;
    article.text = createArticleDto.text;
    article.title = createArticleDto.title;
    const user = await this.userService.findById(userId);
    user.articles.push(article);
    await this.userService.saveUser(user);
    console.log(article);
    return await this.articleRepository.save(article);
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/base/base.service';
import { ArticleEntity } from './entities/article.entity';
import { Repository } from 'typeorm';
import { CreateArticleDto } from './dto/create-article.dto';
import { UserService } from '../user/services/user.service';
import { FileService } from '../image/file.service';

@Injectable()
export class ArticleService extends BaseService<ArticleEntity> {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,
    private userService: UserService,
    private fileService: FileService,
  ) {
    super(articleRepository);
  }

  async createArticle(userId: number, createArticleDto: CreateArticleDto) {
    const article = new ArticleEntity();
    if (createArticleDto.image) {
      const image = await this.fileService.createImage(createArticleDto.image);
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
  async getOne(id: number) {
    return await this.articleRepository.findOne({ where: { id: id } });
  }

  async getAllMy(id: number) {
    const articles = await this.articleRepository.find({
      where: { user: { id: id }, isDeleted: true },
      relations: ['user'],
    });
    for (let i = 0; i < articles.length; i++) {
      delete articles[i].user;
    }
    return articles;
  }

  async deleteArticle(id: number) {
    const article = await this.getOne(id);
    if (article && !article.isDeleted) {
      article.isDeleted = true;
      await this.articleRepository.save(article);
      return { message: 'Successfully deleted' };
    }
    return;
  }
}

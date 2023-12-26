import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/base/base.service';
import { ArticleEntity } from './entities/article.entity';
import { Repository } from 'typeorm';
import { CreateArticleDto } from './dto/create-article.dto';
import { UserService } from '../user/services/user.service';
import { FileService } from '../image/file.service';
import { CategoryService } from '../category/category.service';

@Injectable()
export class ArticleService extends BaseService<ArticleEntity> {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,
    private userService: UserService,
    private categoryService: CategoryService,
    private fileService: FileService,
  ) {
    super(articleRepository);
  }

  async getAllDeleted() {
    return await this.articleRepository.find({
      where: { isDeleted: true },
      relations: ['category'],
    });
  }

  async getAll() {
    return await this.articleRepository.find({
      where: { isDeleted: false },
      relations: ['category'],
    });
  }

  async createArticle(userId: number, createArticleDto: CreateArticleDto) {
    const article = new ArticleEntity();
    if (createArticleDto.file) {
      const file = await this.fileService.createDocx(createArticleDto.file);
      article.fileUrl = file.url;
    }
    const category = await this.categoryService.findOne(
      createArticleDto.category,
    );
    article.category = category;
    article.coauthors = createArticleDto.coauthors;
    article.text = createArticleDto.text;
    article.title = createArticleDto.title;
    const user = await this.userService.findById(userId);
    user.articles.push(article);
    await this.userService.saveUser(user);
    console.log(article);
    return await this.articleRepository.save(article);
  }
  async getOne(id: number) {
    return await this.articleRepository.findOne({
      where: { id: id },
      relations: ['category'],
    });
  }

  async getAllByCategory(name: string) {
    await this.categoryService.findOne(name);
    return await this.articleRepository.find({
      where: { category: { name: name } },
      relations: ['category'],
    });
  }

  async getAllMy(id: number) {
    const articles = await this.articleRepository.find({
      where: { user: { id: id }, isDeleted: false },
      relations: ['user', 'category'],
    });
    for (let i = 0; i < articles.length; i++) {
      delete articles[i].user;
    }
    return articles;
  }

  async getAllMyDeleted(id: number) {
    const articles = await this.articleRepository.find({
      where: { user: { id: id }, isDeleted: true },
      relations: ['user', 'category'],
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
      article.isPublished = false;
      await this.articleRepository.save(article);
      return { message: 'Successfully deleted' };
    }
    return;
  }

  async restoreArticle(id: number) {
    const article = await this.getOne(id);
    if (article && article.isDeleted) {
      article.isDeleted = false;
      await this.articleRepository.save(article);
      return { message: 'Successfully restored' };
    }
    return;
  }

  async approveArticle(id: number) {
    const article = await this.getOne(id);
    if (
      article &&
      !article.isDeleted &&
      article.isApproved == null &&
      article.isPending == true
    ) {
      article.isApproved = true;
      article.isPending = false;
      await this.articleRepository.save(article);
      return { message: 'Successfully approved' };
    }
    return;
  }

  async declineArticle(id: number) {
    const article = await this.getOne(id);
    if (
      article &&
      !article.isDeleted &&
      article.isApproved == null &&
      article.isPending == true
    ) {
      article.isApproved = false;
      article.isPending = false;
      await this.articleRepository.save(article);
      return { message: 'Successfully declined' };
    }
    return;
  }

  async changeVisibility(id: number) {
    const article = await this.getOne(id);
    if (
      article &&
      !article.isDeleted &&
      article.isApproved == true &&
      article.isPending == false
    ) {
      if (article.isPublished == true) {
        article.isPublished = false;
        await this.articleRepository.save(article);
        return { message: 'Successfully depublished' };
      } else {
        article.isPublished = true;
        await this.articleRepository.save(article);
        return { message: 'Successfully published' };
      }
    }
    return;
  }
}

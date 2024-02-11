import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/base/base.service';
import { ArticleEntity } from './entities/article.entity';
import { Repository } from 'typeorm';
import { CreateArticleDto } from './dto/create-article.dto';
import { UserService } from '../user/services/user.service';
import { FileService } from '../image/file.service';
import { CategoryService } from '../category/category.service';
import { SendPaymentDto } from '../email/dto/send_payment.dto';
import { EmailService } from '../email/email.service';
import { StatusEnum } from './enums/status.enum';
import { PublishArticleDto } from './dto/publish-article.dto';
import { AddToArchiveDto } from './dto/add-to-archive.dto';
import { log } from 'console';

@Injectable()
export class ArticleService extends BaseService<ArticleEntity> {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,
    private userService: UserService,
    private categoryService: CategoryService,
    private fileService: FileService,
    private emailService: EmailService,
  ) {
    super(articleRepository);
  }

  async saveArticle(article: ArticleEntity) {
    return await this.articleRepository.save(article);
  }

  async getAllDeleted() {
    return await this.articleRepository.find({
      where: { isDeleted: true },
      relations: ['category'],
    });
  }

  async getAll() {
    const articles = await this.articleRepository.find({
      relations: ['category', 'user'],
    });

    for (let i = 0; i < articles.length; i++) {
      if (articles[i].user) {
        delete articles[i].user.password;
        delete articles[i].user.confirmCodeId;
        delete articles[i].user.passwordRecoveryCodeId;
      }
    }
    return articles;
  }

  async createArticle(
    userId: number,
    createArticleDto: CreateArticleDto,
    pageCount: number,
  ) {
    const article = new ArticleEntity();
    if (createArticleDto.articleFile) {
      const articleFile = await this.fileService.createPdf(
        createArticleDto.articleFile,
      );
      article.fileUrl = articleFile.url;
    }

    const category = await this.categoryService.findOne(
      createArticleDto.category,
    );
    Object.assign(article, createArticleDto);
    article.category = category;
    article.pageCount = pageCount;
    const currentDate = new Date();
    article.year = currentDate.getFullYear();
    article.volume = article.year - 2010;
    const user = await this.userService.findById(userId);
    article.authorName = `${user.firstName} ${user.lastName}`;
    user.articles.push(article);
    await this.userService.saveUser(user);
    console.log(article);
    await this.articleRepository.save(article);
    const sendPaymentDto = new SendPaymentDto();
    sendPaymentDto.articleId = article.id;
    sendPaymentDto.file = createArticleDto.checkFile;
    await this.sendPayment(sendPaymentDto, userId);
    return { message: 'Successfully created article' };
  }
  async getOne(id: number) {
    const article = await this.articleRepository.findOne({
      where: { id: id },
      relations: ['category', 'comments', 'user', 'comments.user'],
    });
    if (article.user) {
      delete article.user.password;
      delete article.user.confirmCodeId;
      delete article.user.passwordRecoveryCodeId;
    }
    for (let i = 0; i < article.comments.length; i++) {
      delete article.comments[i].user.password;
      delete article.comments[i].user.confirmCodeId;
      delete article.comments[i].user.passwordRecoveryCodeId;
    }
    return article;
  }

  async getAllByCategory(name: string) {
    await this.categoryService.findOne(name);
    return await this.articleRepository.find({
      where: { category: { name: name } },
      relations: ['category'],
    });
  }

  async sendPayment(sendPaymentDto: SendPaymentDto, userId: number) {
    const article = await this.getOne(sendPaymentDto.articleId);
    if (article.user.id !== userId) {
      throw new BadRequestException('You can pay only for your article');
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject: 'Payment Receipt for Article Upload',
      text: `Payment receipt for the article "${article.title}" uploaded by ${article.user.firstName} ${article.user.lastName}`,
      attachments: [
        {
          filename: sendPaymentDto.file.originalname,
          content: sendPaymentDto.file.buffer,
        },
      ],
    };

    const sentEmail = await this.emailService.sendMail(mailOptions);
    if (!sentEmail) {
      throw new BadRequestException('Email sending error');
    }
    return { message: 'File sent to admin!' };
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
    if (article && !article.isDeleted && article.status == StatusEnum.PENDING) {
      article.status = StatusEnum.APPROVED;
      await this.articleRepository.save(article);
      return { message: 'Successfully approved' };
    }
    return;
  }

  async declineArticle(id: number) {
    const article = await this.getOne(id);
    if (article && !article.isDeleted && article.status == StatusEnum.PENDING) {
      article.status = StatusEnum.DECLINED;
      await this.articleRepository.save(article);
      return { message: 'Successfully declined' };
    }
    return;
  }
  s;

  async getAllApproved() {
    return await this.articleRepository.find({
      where: { status: StatusEnum.APPROVED },
    });
  }

  async publish(publishDto: PublishArticleDto) {
    const article = await this.getOne(publishDto.articleId);
    if (
      article &&
      !article.isDeleted &&
      article.status == StatusEnum.APPROVED
    ) {
      article.edition = publishDto.editionNumber;
      await this.articleRepository.save(article);
      return {
        message: `Статья опубликована в томе: ${article.volume} в выпуске под номером ${article.edition}`,
      };
    }
    return;
  }

  async addToArchive(dto: AddToArchiveDto, pagesCount) {
    const newArticle = await this.articleRepository.create();
    newArticle.year = +dto.yearString;
    newArticle.volume = +dto.yearString - 2010;
    newArticle.edition = +dto.editionString;
    const category = await this.categoryService.findOne(dto.categoryName);
    newArticle.category = category;
    Object.assign(newArticle, dto);
    const user = await this.userService.findById(+dto.userId);
    newArticle.user = user;
    newArticle.authorName = `${user.firstName} ${user.lastName}`;
    newArticle.pageCount = pagesCount;
    if (dto.articleFile) {
      const articleFile = await this.fileService.createPdf(dto.articleFile);
      newArticle.fileUrl = articleFile.url;
    }
    return await this.articleRepository.save(newArticle);
  }
}

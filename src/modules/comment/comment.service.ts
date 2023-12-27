import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/base/base.service';
import { Repository } from 'typeorm';
import { CommentEntity } from './entites/comment.entity';
import { AddCommentDto } from './dto/addComment.dto';
import { ArticleService } from '../article/article.service';
import { UserService } from '../user/services/user.service';
import { UserRole } from '../user/enums/roles.enum';

@Injectable()
export class CommentService extends BaseService<CommentEntity> {
  constructor(
    @InjectRepository(CommentEntity)
    private readonly commentRepo: Repository<CommentEntity>,
    private readonly articleService: ArticleService,
    private readonly userService: UserService,
  ) {
    super(commentRepo);
  }

  async addComment(
    addCommentDto: AddCommentDto,
    articleId: number,
    userId: number,
  ) {
    const article = await this.articleService.getOne(articleId);

    if (!article) {
      throw new BadRequestException('Article not found');
    }

    const user = await this.userService.findById(userId);

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const isAdmin = user.role === UserRole.ADMIN;
    if (!isAdmin && article.user.id !== user.id) {
      throw new BadRequestException(
        'You can only comment on your own articles',
      );
    }

    const comment = this.commentRepo.create({
      text: addCommentDto.text,
      article,
      user,
    });

    return await this.commentRepo.save(comment);
  }
}

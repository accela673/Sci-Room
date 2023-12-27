import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/base/base.service';
import { Repository } from 'typeorm';
import { CommentEntity } from './entites/comment.entity';
import { AddCommentDto } from './dto/addComment.dto';
import { ArticleService } from '../article/article.service';
import { UserService } from '../user/services/user.service';

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
}

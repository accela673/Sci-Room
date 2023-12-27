import { Module } from '@nestjs/common';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentEntity } from './entites/comment.entity';
import { ArticleModule } from '../article/article.module';
import { UserModule } from '../user/user.module';
import { ArticleService } from '../article/article.service';
import { UserService } from '../user/services/user.service';
import { ArticleEntity } from '../article/entities/article.entity';
import { CategoryModule } from '../category/category.module';
import { CategoryService } from '../category/category.service';
import { CategoryEntity } from '../category/entities/category.entity';
import { FileModule } from '../image/file.module';
import { UserEntity } from '../user/entities/user.entity';
import { CodeEntity } from '../user/entities/code.entity';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CommentEntity,
      ArticleEntity,
      CategoryEntity,
      UserEntity,
      CodeEntity,
    ]),
    ArticleModule,
    UserModule,
    CategoryModule,
    FileModule,
    EmailModule,
  ],
  controllers: [CommentController],
  providers: [CommentService, ArticleService, UserService, CategoryService],
  exports: [CommentService],
})
export class CommentModule {}

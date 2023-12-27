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

@Module({
  imports: [
    TypeOrmModule.forFeature([CommentEntity, ArticleEntity, CategoryEntity]),
    ArticleModule,
    UserModule,
    CategoryModule,
  ],
  controllers: [CommentController],
  providers: [CommentService, ArticleService, UserService, CategoryService],
  exports: [CommentService],
})
export class CommentModule {}

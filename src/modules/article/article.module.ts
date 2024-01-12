import { Module } from '@nestjs/common';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleEntity } from './entities/article.entity';
import { UserModule } from '../user/user.module';
import { FileModule } from '../image/file.module';
import { CategoryModule } from '../category/category.module';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ArticleEntity]),
    UserModule,
    FileModule,
    CategoryModule,
    EmailModule,
  ],
  controllers: [ArticleController],
  providers: [ArticleService],
  exports: [ArticleService],
})
export class ArticleModule {}

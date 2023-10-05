import { Module } from '@nestjs/common';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleEntity } from './entities/article.entity';
import { UserModule } from '../user/user.module';
import { ImageModule } from '../image/image.module';

@Module({
  imports: [TypeOrmModule.forFeature([ArticleEntity]), UserModule, ImageModule],
  controllers: [ArticleController],
  providers: [ArticleService],
})
export class ArticleModule {}

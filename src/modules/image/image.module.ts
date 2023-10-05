import { Module } from '@nestjs/common';
import { ImageService } from './image.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Image } from './entities/image.entity';
import { CloudinaryModule } from '../../services/cloudinary/cloudinary.modules';
import { ImageController } from './image.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Image]), CloudinaryModule],
  providers: [ImageService],
  controllers: [ImageController],
  exports: [ImageService],
})
export class ImageModule {}

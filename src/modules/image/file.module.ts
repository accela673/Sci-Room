import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Image } from './entities/image.entity';
import { CloudinaryModule } from '../cloudinary/cloudinary.modules';
import { FileController } from './file.controller';
import { Pdf } from './entities/pdf.entity';
import { DocX } from './entities/txt.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Image, Pdf, DocX]), CloudinaryModule],
  providers: [FileService],
  controllers: [FileController],
  exports: [FileService],
})
export class FileModule {}

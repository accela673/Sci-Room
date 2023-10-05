import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Image } from './entities/image.entity';
import { Repository } from 'typeorm';
import { CloudinaryService } from '../../services/cloudinary/cloudinary.service';

@Injectable()
export class ImageService {
  constructor(
    @InjectRepository(Image)
    private readonly imagesRepository: Repository<Image>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async createImage(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Provide image');
    }
    const cloudImage = await this.cloudinaryService.uploadImage(file);
    const image = new Image();
    image.publicId = cloudImage.public_id;
    image.url = cloudImage.secure_url;
    return this.imagesRepository.save(image);
  }
}

import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Image } from './entities/image.entity';
import { Repository } from 'typeorm';
import { CloudinaryService } from '../../services/cloudinary/cloudinary.service';
import { Pdf } from './entities/pdf.entity';
import { DocX } from './entities/txt.entity';

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(Image)
    private readonly imagesRepository: Repository<Image>,
    @InjectRepository(Pdf)
    private readonly pdfRepository: Repository<Pdf>,
    @InjectRepository(DocX)
    private readonly docxRepository: Repository<DocX>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async createPdf(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Provide pdf file');
    }
    const cloudPdf = await this.cloudinaryService.uploadPdf(file);
    const pdf = new Pdf();
    pdf.url = cloudPdf.secure_url;
    pdf.publicId = cloudPdf.public_id;
    return this.pdfRepository.save(pdf);
  }

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

  async createDocx(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Provide docx file');
    }
    const cloudDocx = await this.cloudinaryService.uploadDocx(file);
    const docx = new DocX();
    docx.publicId = cloudDocx.public_id;
    docx.url = cloudDocx.secure_url;
    return this.docxRepository.save(docx);
  }
}

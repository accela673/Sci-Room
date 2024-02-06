import { Injectable } from '@nestjs/common';
import { CreateArchiveDto } from './dto/create-archive.dto';
import { UpdateArchiveDto } from './dto/update-archive.dto';

@Injectable()
export class ArchiveService {
  create(createArchiveDto: CreateArchiveDto) {
    return 'This action adds a new archive';
  }

  findAll() {
    return `This action returns all archive`;
  }

  findOne(id: number) {
    return `This action returns a #${id} archive`;
  }

  update(id: number, updateArchiveDto: UpdateArchiveDto) {
    return `This action updates a #${id} archive`;
  }

  remove(id: number) {
    return `This action removes a #${id} archive`;
  }
}

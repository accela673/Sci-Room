import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ArchiveService } from './archive.service';
import { CreateArchiveDto } from './dto/create-archive.dto';
import { UpdateArchiveDto } from './dto/update-archive.dto';

@Controller('archive')
export class ArchiveController {
  constructor(private readonly archiveService: ArchiveService) {}

  @Post()
  create(@Body() createArchiveDto: CreateArchiveDto) {
    return this.archiveService.create(createArchiveDto);
  }

  @Get()
  findAll() {
    return this.archiveService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.archiveService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateArchiveDto: UpdateArchiveDto) {
    return this.archiveService.update(+id, updateArchiveDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.archiveService.remove(+id);
  }
}

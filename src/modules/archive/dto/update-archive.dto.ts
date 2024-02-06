import { PartialType } from '@nestjs/mapped-types';
import { CreateArchiveDto } from './create-archive.dto';

export class UpdateArchiveDto extends PartialType(CreateArchiveDto) {}

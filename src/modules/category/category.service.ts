import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { BaseService } from 'src/base/base.service';
import { CategoryEntity } from './entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CategoryService extends BaseService<CategoryEntity> {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepo: Repository<CategoryEntity>,
  ) {
    super(categoryRepo);
  }
  async findOne(name: string) {
    const category = await this.categoryRepo.findOne({ where: { name: name } });
    if (!category) {
      throw new BadRequestException(`Category with name '${name}' not found`);
    }
    return category;
  }

  async createOne(cateoryDto: CreateCategoryDto) {
    const isExist = await this.categoryRepo.findOne({
      where: { name: cateoryDto.name },
    });
    if (isExist) {
      throw new BadRequestException('Category is already exists');
    }
    const newCategory = this.categoryRepo.create(cateoryDto);
    return await this.categoryRepo.save(newCategory);
  }
}

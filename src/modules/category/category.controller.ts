import { Controller, Get, Post, Body } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Categories')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post('/create')
  @ApiOperation({ summary: ' Create new category ' })
  async creaateCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return await this.categoryService.createOne(createCategoryDto);
  }

  @Get('/list')
  @ApiOperation({ summary: 'Получить список всех категорий' })
  async getList() {
    return await this.categoryService.listAllCategories();
  }
}

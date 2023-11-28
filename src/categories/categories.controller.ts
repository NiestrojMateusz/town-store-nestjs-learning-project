import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Logger,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { NewCategoryDto } from './dto/new-category-dto';
import { Category } from './category.interface';
import { CategoriesService } from './categories.service';
import { UpdateCategoryDto } from './dto/update-category-dto';

@Controller('categories')
export class CategoriesController {
  private logger = new Logger(CategoriesController.name);

  constructor(private categoriesService: CategoriesService) {}

  @Get()
  getAll(): readonly Category[] {
    return this.categoriesService.getAll();
  }

  @Get(':id')
  getSingleCategory(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    categoryId: number,
  ) {
    this.logger.debug('Get category');
    return this.categoriesService.getOneById(categoryId);
  }

  @Post()
  addNewCategory(@Body() payload: NewCategoryDto) {
    return this.categoriesService.createNew(payload);
  }

  @Delete(':id')
  delateCategory(@Param('id') categoryId: number) {
    return this.categoriesService.removeById(categoryId);
  }

  @Patch(':categoryId')
  update(
    @Param('categoryId') categoryId: number,
    @Body() category: UpdateCategoryDto,
  ): Category {
    return this.categoriesService.update(categoryId, category);
  }
}

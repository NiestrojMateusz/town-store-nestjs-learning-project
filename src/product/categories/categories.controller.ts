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
  UseGuards,
} from '@nestjs/common';
import { NewCategoryDto } from './dto/new-category-dto';
import { CategoriesService } from './categories.service';
import { UpdateCategoryDto } from './dto/update-category-dto';
import { ApiKeyGuard } from 'src/guards/api-key.guard';
import { CategoryModel } from './category.model';

@Controller('categories')
export class CategoriesController {
  private logger = new Logger(CategoriesController.name);

  constructor(private categoriesService: CategoriesService) {}

  @Get()
  getAll(): Promise<CategoryModel[]> {
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
  @UseGuards(ApiKeyGuard)
  addNewCategory(@Body() payload: NewCategoryDto) {
    return this.categoriesService.addNew(payload);
  }

  @Delete(':id')
  @UseGuards(ApiKeyGuard)
  delateCategory(@Param('id') categoryId: number) {
    return this.categoriesService.removeById(categoryId);
  }

  @Patch(':categoryId')
  update(
    @Param('categoryId') categoryId: number,
    @Body() category: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(categoryId, category);
  }
}

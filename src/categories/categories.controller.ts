import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { NewCategoryDto } from './dto/new-category-dto';
import { categoryList } from './category-list';
import { Category } from './category.interface';

@Controller('categories')
export class CategoriesController {
  private categories: Category[] = categoryList;

  private nextId = 8;

  private getCategoryById(categoryId: number) {
    const category = this.categories.find((c) => c.id === categoryId);

    return category;
  }

  @Get()
  getAll(): Category[] {
    return this.categories;
  }

  @Get(':id')
  getSingleCategory(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    categoryId: number,
  ) {
    const category = this.getCategoryById(categoryId);

    if (!category) {
      throw new NotFoundException(`category with id: ${categoryId} not found`);
    }

    return category;
  }

  @Post()
  addNewCategory(@Body() payload: NewCategoryDto) {
    const category: Category = { ...payload, id: this.nextId++ };
    this.categories.push(category);
    return category;
  }

  @Delete(':id')
  delateCategory(@Param('id') categoryId: number) {
    const category = this.getCategoryById(categoryId);

    if (!category) {
      throw new NotFoundException(`category with id: ${categoryId} not found`);
    }

    this.categories = this.categories.filter((cat) => cat.id !== category.id);

    return { id: categoryId, removed: true };
  }
}

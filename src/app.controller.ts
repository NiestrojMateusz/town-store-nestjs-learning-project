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
import { NewCategoryDto } from './new-category-dto';

interface Category {
  id: number;
  name: string;
}

@Controller('categories')
export class AppController {
  private categories: Category[] = [
    { id: 1, name: 'Groceries' },
    { id: 2, name: 'Cosmetics' },
    { id: 3, name: 'Toys' },
    { id: 4, name: 'Dairy' },
    { id: 5, name: 'Fashion' },
    { id: 6, name: 'Electronics' },
    { id: 7, name: 'Games' },
  ];

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

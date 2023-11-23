import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';

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

  @Get()
  getAll(): Category[] {
    return this.categories;
  }

  @Get(':id')
  getSingleCategory(@Param('id') categoryId: string) {
    return this.categories.find((c) => c.id === Number(categoryId));
  }

  @Post()
  addNewCategory(@Body() payload: { name: string }) {
    const category: Category = { id: this.nextId++, ...payload };
    this.categories.push(category);
    return category;
  }

  @Delete(':id')
  delateCategory(@Param('id') categoryId: string) {
    this.categories = this.categories.filter(
      (cat) => cat.id !== Number(categoryId),
    );

    return categoryId;
  }
}

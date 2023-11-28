import { Injectable, NotFoundException } from '@nestjs/common';
import { categoryList } from './category-list';
import { Category } from './category.interface';
import { NewCategoryDto } from './dto/new-category-dto';
import { UpdateCategoryDto } from './dto/update-category-dto';

@Injectable()
export class CategoriesService {
  private categories: Category[] = categoryList;

  private generateNextId(): number {
    return Math.max(...this.categories.map((c) => c.id)) + 1;
  }

  private findCategory(id: number): Category {
    const category = this.categories.find((c) => c.id === id);
    if (!category) {
      throw new NotFoundException(`Category with id: ${id} not found`);
    }

    return category;
  }

  getAll(name: string = ''): readonly Category[] {
    return this.categories.filter((c) =>
      c.name.toLowerCase().includes(name.toLowerCase()),
    );
  }

  getOneById(id: number) {
    return this.findCategory(id);
  }

  createNew(category: NewCategoryDto): Category {
    const newCategory: Category = {
      id: this.generateNextId(),
      ...category,
    };
    this.categories.push(newCategory);
    return newCategory;
  }

  update(id: number, partialCategory: UpdateCategoryDto): Category {
    const categoryToUpdate = this.findCategory(id);
    Object.assign(categoryToUpdate, partialCategory);
    return categoryToUpdate;
  }

  removeById(id: number): { id: number; removed: boolean } {
    this.findCategory(id);
    this.categories = this.categories.filter((c) => c.id !== id);
    return { id, removed: true };
  }
}

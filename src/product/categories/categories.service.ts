import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Category } from './category.interface';
import { NewCategoryDto } from './dto/new-category-dto';
import { UpdateCategoryDto } from './dto/update-category-dto';
import { Knex } from 'knex';

@Injectable()
export class CategoriesService {
  private logger = new Logger(CategoriesService.name);

  constructor(@Inject('DbConnection') private readonly knex: Knex) {}

  private async findCategory(id: number): Promise<Category> {
    this.logger.debug(`Searching for category ${id}`);
    const category = await this.knex<Category>('categories')
      .where({ id })
      .first();
    if (!category) {
      throw new NotFoundException(`category with id: ${id} not found`);
    }
    return category;
  }

  getAll(): Promise<Category[]> {
    return this.knex<Category>('categories');
  }

  getOneById(id: number): Promise<Category> {
    return this.findCategory(id);
  }

  async createNew(category: NewCategoryDto): Promise<Category> {
    try {
      const [newOne] = await this.knex<Category>('categories').insert({
        ...category,
      });
      return this.getOneById(newOne);
    } catch (error) {
      if (error?.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        throw new BadRequestException(
          `Category named "${category.name}" already exist`,
        );
      }
      throw error;
    }
  }

  async update(
    id: number,
    partialCategory: UpdateCategoryDto,
  ): Promise<Category> {
    const categoryToUpdate = await this.findCategory(id);
    Object.assign(categoryToUpdate, partialCategory);

    return await this.knex('categories').where({ id }).update(categoryToUpdate);
  }

  async removeById(id: number): Promise<{ id: number; removed: number }> {
    await this.getOneById(id);
    const removed = await this.knex('categories').where({ id }).delete();
    this.logger.log(`Removing category ${id}`);
    return { id, removed };
  }
}

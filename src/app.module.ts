import { Module } from '@nestjs/common';
import { ProductsController } from './products/products.controller';
import { CategoriesController } from './categories/categories.controller';
import { ProductsService } from './products/products.service';
import { CategoriesService } from './categories/categories.service';

@Module({
  imports: [],
  controllers: [CategoriesController, ProductsController],
  providers: [ProductsService, CategoriesService],
})
export class AppModule {}

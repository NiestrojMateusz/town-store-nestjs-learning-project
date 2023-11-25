import { Module } from '@nestjs/common';
import { ProductsController } from './products/products.controller';
import { CategoriesController } from './categories/categories.controller';

@Module({
  imports: [],
  controllers: [CategoriesController, ProductsController],
  providers: [],
})
export class AppModule {}

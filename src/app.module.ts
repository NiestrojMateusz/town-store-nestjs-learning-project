import { Module } from '@nestjs/common';
import { ProductsController } from './products/products.controller';
import { CategoriesController } from './categories/categories.controller';
import { ProductsService } from './products/products.service';

@Module({
  imports: [],
  controllers: [CategoriesController, ProductsController],
  providers: [ProductsService],
})
export class AppModule {}

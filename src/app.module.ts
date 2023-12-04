import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ProductsController } from './product/products/products.controller';
import { CategoriesController } from './product/categories/categories.controller';
import { ProductsService } from './product/products/products.service';
import { CategoriesService } from './product/categories/categories.service';
import { LoggerModule } from 'nestjs-pino';
import * as path from 'path';
import { APP_FILTER } from '@nestjs/core';
import { AllErrorsFilter } from './errors/all-errors.filter';
import { CookieCheckMiddleware } from './middleware/cookie-check.middleware';
import { LanguageExtractorMiddleware } from './middleware/language-extractor.middleware';
import { ProductModule } from './product/product.module';
import { OrdersModule } from './orders/orders.module';
import { SharedModule } from './shared/shared.module';
import { DatabaseModule } from './database/database.module';
import { ProductModel } from './product/products/product.model';
import { CategoryModel } from './product/categories/category.model';
@Module({
  imports: [
    /* klasy innych modułów */
    LoggerModule.forRoot({
      pinoHttp: {
        level: 'debug',
        useLevel: 'debug',
        transport: {
          target: path.resolve(__dirname, 'pino-pretty-config.js'),
        },
        quietReqLogger: true,
      },
    }),
    ProductModule,
    OrdersModule,
    SharedModule,
    DatabaseModule,
  ],
  controllers: [
    /* klasy kontrolerów w tym module */
    CategoriesController,
    ProductsController,
  ],
  providers: [
    /* klasy serwisów w tym module */
    ProductsService,
    CategoriesService,
    {
      provide: APP_FILTER,
      useClass: AllErrorsFilter,
    },
    {
      provide: 'ProductModel',
      useValue: ProductModel,
    },
    {
      provide: 'CategoryModel',
      useValue: CategoryModel,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LanguageExtractorMiddleware, CookieCheckMiddleware)
      .forRoutes('*');
  }
}

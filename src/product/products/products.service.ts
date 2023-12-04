import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { NewProductDto } from './dto/new-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CategoriesService } from 'src/product/categories/categories.service';
import { ProductModel } from './product.model';
import { ModelClass } from 'objection';

@Injectable()
export class ProductsService {
  private logger = new Logger(ProductsService.name);
  constructor(
    private categoriesService: CategoriesService,
    @Inject('ProductModel')
    private readonly productModel: ModelClass<ProductModel>,
  ) {}

  private async findProduct(id: number) {
    this.logger.debug(`Searching for product ${id}`);

    // const product = await this.knex<Product>('products').where({ id }).first();
    const product = await this.productModel
      .query()
      .findById(id)
      .withGraphFetched('category')
      .throwIfNotFound(`Product with id: ${id} not found`);

    if (!product) {
      throw new NotFoundException(`Product with id: ${id} not found`);
    }

    return product;
  }

  async createNew(product: NewProductDto) {
    this.categoriesService.getOneById(product.categoryId);

    const newProduct = await this.productModel.query().insert({
      stock: 0,
      ...product,
    });
    this.logger.log(`Created product with id: ${newProduct.id}`);

    return newProduct;
  }

  async getAll(name: string = '') {
    return this.productModel.query().whereLike('name', `%${name}%`);
  }

  getOneById(id: number) {
    this.logger.verbose(`Read product id: ${id}`);
    this.logger.debug(`Read product id: ${id}`);
    this.logger.log(`Read product id: ${id}`);
    this.logger.warn(`Read product id: ${id}`);
    this.logger.error(`Read product id: ${id}`);
    this.logger.fatal(`Read product id: ${id}`);
    return this.findProduct(id);
  }

  async update(id: number, partialProduct: UpdateProductDto) {
    if (partialProduct.categoryId) {
      await this.categoriesService.getOneById(partialProduct.categoryId);
    }
    const product = await this.productModel.query().findById(id);
    return product.$query().updateAndFetch(partialProduct);
  }

  async removeById(id: number): Promise<number> {
    await this.findProduct(id);
    return this.productModel.query().deleteById(id);
  }
}

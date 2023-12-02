import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Product } from './product.interface';
import { NewProductDto } from './dto/new-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CategoriesService } from 'src/product/categories/categories.service';
import { Knex } from 'knex';

@Injectable()
export class ProductsService {
  private logger = new Logger(ProductsService.name);
  constructor(
    @Inject('DbConnection') private readonly knex: Knex,
    private categoriesService: CategoriesService,
  ) {}

  private async findProduct(id: number): Promise<Product> {
    this.logger.debug(`Searching for product ${id}`);

    const product = await this.knex<Product>('products').where({ id }).first();

    if (!product) {
      throw new NotFoundException(`Product with id: ${id} not found`);
    }
    return product;
  }

  async createNew(product: NewProductDto): Promise<Product> {
    this.categoriesService.getOneById(product.category_id);

    const newProductIds = await this.knex('products').insert(product);
    this.logger.log(`Created product with id: ${newProductIds[0]}`);

    return this.knex('products').where({ id: newProductIds[0] }).first();
  }

  async getAll(name: string = ''): Promise<Product[]> {
    let products = this.knex<Product>('products').select('*');

    if (name) {
      products = products.where('name', 'like', `%${name}%`);
    }

    return products;
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
    const productToUpdate = await this.findProduct(id);
    Object.assign(productToUpdate, partialProduct);
    if (partialProduct.category_id) {
      await this.categoriesService.getOneById(partialProduct.category_id);
    }
    await this.knex<Product>('products').where({ id }).update(productToUpdate);

    return productToUpdate;
  }

  async removeById(id: number): Promise<void> {
    await this.findProduct(id);
    await this.knex('products').where({ id }).delete();
    this.logger.log(`Removing product ${id}`);
  }
}

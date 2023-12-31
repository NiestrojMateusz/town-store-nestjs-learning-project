import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { NewProductDto } from './dto/new-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CategoriesService } from '../categories/categories.service';
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
    return this.productModel
      .query()
      .findById(id)
      .throwIfNotFound(`Product with id: ${id} not found`);
  }

  async createNew(product: NewProductDto) {
    await this.categoriesService.getOneById(product.categoryId);
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

  async checkProductOnStock(id: number, quantity: number) {
    const product = await this.findProduct(id);
    if (product.stock < quantity) {
      throw new BadRequestException(`Product :${id} is out of stock.`);
    }
    return product;
  }

  getOneById(id: number) {
    this.logger.verbose(`Read product id: ${id}`);
    return this.findProduct(id);
  }

  async update(id: number, partialProduct: UpdateProductDto) {
    if (partialProduct.categoryId) {
      await this.categoriesService.getOneById(partialProduct.categoryId);
    }
    const product = await this.productModel.query().findById(id);
    return product.$query().updateAndFetch(partialProduct);
  }

  async removeById(id: number) {
    await this.findProduct(id);
    return this.productModel.query().deleteById(id);
  }
}

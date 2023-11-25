import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { productList } from './product-list';
import { NewProductDto } from './dto/new-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './product.interface';

@Controller('products')
export class ProductsController {
  private products: Product[] = productList;
  private productId: number = productList.length;

  findProduct(id: number): Product {
    const product = this.products.find((p) => p.id === id);
    if (!product) {
      throw new NotFoundException(`Product with id: ${id} not found`);
    }
    return product;
  }

  @Get()
  findAll() {
    return this.products;
  }

  @Get(':id')
  findById(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: number,
  ) {
    const product = this.findProduct(id);
    return product;
  }

  @Post()
  createProduct(@Body() product: NewProductDto) {
    const newProduct: Product = {
      id: this.productId++,
      stock: 0,
      ...product,
    };
    this.products.push(newProduct);
    return newProduct;
  }

  @Patch(':id')
  updateProduct(
    @Param('id') productId: number,
    @Body() product: UpdateProductDto,
  ) {
    const productToUpdate = this.findProduct(productId);
    Object.assign(productToUpdate, product);
    return productToUpdate;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeProduct(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    productId: number,
  ) {
    this.findProduct(productId);
    this.products = this.products.filter((p) => p.id !== productId);
  }
}

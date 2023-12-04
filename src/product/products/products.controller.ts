import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { NewProductDto } from './dto/new-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsService } from './products.service';

import * as fsp from 'node:fs/promises';
import { ClientLanguage } from 'src/middleware/client-language.decorator';
import { ApiKeyGuard } from 'src/guards/api-key.guard';
import { SupportedLanguages } from 'src/shared/language/language.service';

@Controller('products')
export class ProductsController {
  private logger = new Logger(ProductsController.name);
  constructor(private productsService: ProductsService) {}

  @Post()
  @UseGuards(ApiKeyGuard)
  addNew(@Body() product: NewProductDto) {
    this.logger.log('About to add');
    this.logger.log(product);
    return this.productsService.createNew(product);
  }

  @Get('test-file')
  async getAllFromFile() {
    const fileData = await fsp.readFile('not-existing-file.txt');
    return { fileData };
  }

  @Get('sample-error')
  async getSampleError(@ClientLanguage() lang: SupportedLanguages) {
    throw new BadRequestException(
      lang === 'pl'
        ? 'Błąd z przykładową wiadomością'
        : 'Error with sample message',
    );
  }

  @Get()
  getAll(@Query('name') searchByName: string) {
    return this.productsService.getAll(searchByName);
  }

  @Get(':productId')
  getOne(
    @Param(
      'productId',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    productId: number,
  ) {
    return this.productsService.getOneById(productId);
  }

  @Patch(':productId')
  update(
    @Param(
      'productId',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    productId: number,
    @Body() product: UpdateProductDto,
  ) {
    return this.productsService.update(productId, product);
  }

  @Delete(':productId')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @Param(
      'productId',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    productId: number,
  ): Promise<number> {
    return this.productsService.removeById(productId);
  }
}

import { NewProductDto } from './new-product.dto';
import { PartialType } from '@nestjs/mapped-types';
export class UpdateProductDto extends PartialType(NewProductDto) {}

import { PartialType } from '@nestjs/mapped-types';
import { NewCategoryDto } from './new-category-dto';

export class UpdateCategoryDto extends PartialType(NewCategoryDto) {}

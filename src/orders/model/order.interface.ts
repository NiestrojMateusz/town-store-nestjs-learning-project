import { Product } from 'src/product/products/product.interface';

export interface Order {
  id: number;
  madeAt: Date;
  products: ProductInOrder[];
  status: 'OPENED' | 'IN_PROGRESS' | 'SHIPPED' | 'CLOSED';
  totalPrice: number;
}

export interface ProductInOrder {
  id: number;
  productId: Product['id'];
  quantity: number;
}

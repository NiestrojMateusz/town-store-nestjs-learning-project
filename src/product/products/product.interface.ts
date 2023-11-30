export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  stock: number;
  categoryId: number;
  description?: string;
}

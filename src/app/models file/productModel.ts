export interface Product {
  id?: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  supplier_id: number | null;
  category_id: number | null;
  supplier: number | null;
  category: number | null;
  image?: String | null; // Optional field for image URL
}

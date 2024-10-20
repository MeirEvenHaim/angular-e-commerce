// src/app/models/cart.model.ts
export interface Cart {
    id: number;
    cart_items : CartItem[];
    client: number;  // Client name or ID
    products: string[];  // Array of product names or IDs
    created_at: string;  // Timestamp of when the cart was created
  }

  export interface CartItem {
    id: number;
    cart: number;  // Cart ID reference
    product: number;  // Product ID reference
    productName: string;  // Product name for display
    quantity: number;  // Quantity of the product in the cart
  }


  // product.model.ts
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

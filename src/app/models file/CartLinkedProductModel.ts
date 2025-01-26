import { Cart } from "./CartModel";
import { Product } from "./productModel";

  export interface CartLinkedProduct {
    id : number ;
    cart_id: Cart[];  // Cart ID reference
    product_id: Product[];  // Product ID reference
    product_name? : string;
    product_price? : number;
    client_name? : string;
    quantity: number;  // Quantity of the product in the cart
  }

// src/app/models/cart.model.ts

  export interface CartLinkedProduct {
    id : number ;
    cart_id: number;  // Cart ID reference
    product_id: number;  // Product ID reference
    product_name? : string;
    product_price? : number;
    client_name? : string;
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




export interface Cart {
  id?: number;
  client_name?: string;     // Optional field to match the client name from the user
  user?: number;            // ID of the user who owns the cart
  cart_link_product?: { // Array of products in the cart
    product_name: string;
    quantity: number;
    product_price? : number;
  }[];
  total_price?: number;     // Total price of the cart
  created_at?: string;      // Timestamp of when the cart was created
  payment?: {               // Payment information for the cart
    id?: number;            // Payment ID
    order_price: number;    // Price of the cart/order
    currency: string;       // Currency of the payment
    payment_date?: string;  // Date and time of the payment (ISO format)
    amount_payed: string;   // Amount paid (as a decimal string)
    payment_method: 'Credit Card' | 'PayPal'; // Payment method
    paypal_id?: string | null; // PayPal Transaction ID (nullable)
    payment_status: 'Pending' | 'Completed' | 'Failed'; // Status of the payment
  } | null;  // Nullable to represent if there is no payment made yet
}



export interface Payment {
  id?: number; // Payment ID, if applicable
  order_price: number; // Cart ID (linked via OneToOneField)
  currency: string; // Currency of the payment
  payment_date?: string; // Date and time of the payment (ISO format)
  amount_payed: string; // Amount paid (as a decimal string)
  payment_method: 'Credit Card' | 'PayPal'; // Payment method
  paypal_id?: string | null; // PayPal Transaction ID (nullable)
  payment_status: 'Pending' | 'Completed' | 'Failed'; // Status of the payment
}

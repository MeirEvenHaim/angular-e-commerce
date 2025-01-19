// src/app/models/cart.model.ts

  export interface CartLinkedProduct {
    id : number ;
    cart_id: Cart[];  // Cart ID reference
    product_id: Product[];  // Product ID reference
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
  locked? : boolean
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
  id?: number; // Optional payment ID (auto-generated in the backend)
  order_price: {
    client_name?: string; // Optional client name
    total_price?: number; // Total price of the cart
    cart_link_product?: {
      product_name: string; // Product name
      quantity: number; // Quantity of the product
      product_price?: number; // Optional price of the product
    }[]; // Array of products in the cart
  };
  currency: string; // Payment currency (e.g., "USD")
  amount_payed: string; // Total amount paid (matches Django's DecimalField)
  payment_method: string; // Payment method (e.g., "PayPal")
  payer_email: string; // Payer's email address
  payer_name: string; // Full name of the payer
  paypal_id: string; // PayPal transaction ID
  status: string; // Payment status (e.g., "Pending", "Completed", etc.)
  transaction_fee?: string; // Optional transaction fee
  payment_metadata?: any; // Optional raw payment metadata
}
export interface Categories {
id? : number;
name : string ;
description : Blob | null ;
}


export interface Suppliers {
  id : number;
  name : string ;
  contact_email : string | null ;
  phone_number : number;
  address : string ;
  }


  export interface Shipping {
    id? : number;
    cart_id: number;  // Changed from Cart[] to a single Cart instance (since it's OneToOne relationship)
    shipping_address: string;
    shipping_date: Date | null;  // Date in ISO format or null
    shipping_method: 'Standard' | 'Express';  // Match the choices from the Django model
    delivery_date: Date | null;  // Date in ISO format or null

  }






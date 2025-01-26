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

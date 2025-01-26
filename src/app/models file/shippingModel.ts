export interface Shipping {
  id? : number;
  cart_id: number;  // Changed from Cart[] to a single Cart instance (since it's OneToOne relationship)
  shipping_address: string;
  shipping_date: Date | null;  // Date in ISO format or null
  shipping_method: 'Standard' | 'Express';  // Match the choices from the Django model
  delivery_date: Date | null;  // Date in ISO format or null

}

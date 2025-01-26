import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services copy/client_cart_Service/cart-linked-products.service';
import { CartLinkedProduct } from '../../models file/CartLinkedProductModel';
import { Product } from '../../models file/productModel';

@Component({
  selector: 'app-cart-linked-products.component',
  templateUrl: './cart-linked-products.component.html',
  styleUrls: ['./cart-linked-products.component.css'],
})
export class CartItemsComponent implements OnInit {
  cartItems: CartLinkedProduct[] = [];
  newProductId: number = 0;
  newQuantity: number = 1;
  newCartId: number = 0;
  product_price: number = 0;
  errorMessage: string = '';
  buttonStyles: any = {};
  newProductName: string = '';
  ClientName: string = '';
  quantity: number = 0;
  productItems: Product[] = []; // Array of Product items
  constructor(private cartService: CartService) {}

  displayedColumns: string[] = [
    'client_name',
    'cart',
    'product_name',
    'quantity',
    'product_price',
    'actions',
  ];

  ngOnInit(): void {
    this.loadCartItems();
  }

  // Load all cart items
  loadCartItems(): void {
    this.cartService.getCartItems().subscribe({
      next: (items) => {
        this.cartItems = items;
        console.log(items);
      },
      error: (error) => {
        this.errorMessage = 'Error loading cart items';
        console.error('Error loading cart items:', error);
      },
    });
  }

  getPriceForProduct(productName: string): number {
    const product = this.cartItems.find(
      (item) => item.product_name === productName
    );
    return product ? product.product_price! : 0;
  }

  addProduct(): void {
    if (this.newCartId && this.newProductId && this.newQuantity > 0) {
      // Call the service method to add the product
      this.cartService
        .addProductToCart(
          this.newCartId,
          this.newProductId,
          this.newQuantity,
          this.ClientName,
          this.newProductName
        )
        .subscribe({
          next: (newItem) => {
            this.cartItems.push(newItem);
            this.resetForm();
            console.log('Product added successfully:', newItem);
          },
          error: (error) => {
            // Check for "out of stock" in the error response
            if (
              error.status === 400 &&
              error.error?.message === 'Product is out of stock'
            ) {
              this.errorMessage = 'The product is out of stock';
            } else {
              this.errorMessage = 'Error adding product to cart';
            }
            console.error('Error adding product to cart:', error);
          },
        });
    } else {
      this.errorMessage = 'Please provide valid input values';
    }
  }

  updateQuantity_and_Items(cartItem: any, newQuantity: number): void {
    const updatedItem = { ...cartItem, quantity: newQuantity }; // Update the quantity field

    this.cartService.updateCartItem(updatedItem).subscribe({
      next: (response) => {
        console.log('Updated Item:', response);

        // Update the item in the local cartItems array
        const index = this.cartItems.findIndex(
          (item) => item.id === cartItem.id
        );
        if (index !== -1) {
          this.cartItems[index] = response;
        }
      },
      error: (error) => {
        // Handle "out of stock" error
        if (
          error.status === 400 &&
          error.error?.message === 'Product is out of stock'
        ) {
          this.errorMessage = 'The updated quantity exceeds available stock';
        } else {
          this.errorMessage = 'Error updating cart item';
        }
        console.error('Error updating cart item:', error);
      },
    });
  }

  // Remove a cart item
  removeItem(cartItemId: number): void {
    this.cartService.removeProductFromCart(cartItemId).subscribe({
      next: () => {
        this.cartItems = this.cartItems.filter(
          (item) => item.id !== cartItemId
        );
      },
      error: (error) => {
        this.errorMessage = 'Error removing product from cart';
        console.error('Error removing product from cart:', error);
      },
    });
  }

  onMouseMove(event: MouseEvent, buttonId: string) {
    const button = event.target as HTMLElement;
    const rect = button.getBoundingClientRect();
    const x = event.clientX - rect.left; // Mouse X position relative to button
    const y = event.clientY - rect.top; // Mouse Y position relative to button
    const width = rect.width;
    const height = rect.height;

    // Calculate the percentage of mouse position in the button
    const xPercentage = (x / width) * 100;
    const yPercentage = (y / height) * 100;

    // Update the dynamic gradient based on mouse position for the specific button
    this.buttonStyles[buttonId] = {
      background: `linear-gradient(45deg, rgba(155, 28, 28, 0.7) ${xPercentage}%, rgba(14, 61, 105, 0.7) ${
        100 - xPercentage
      }%)`,
      boxShadow: `0 6px 18px rgba(0, 0, 0, 0.1), inset 0 0 10px rgba(0, 0, 0, 0.3)`,
    };
  }

  onMouseLeave(buttonId: string) {
    // Reset the button style back to default when the mouse leaves for the specific button
    this.buttonStyles[buttonId] = {
      background: '#9b1c1c', // Default Ruby Red color
      boxShadow: '0 6px 18px rgba(0, 0, 0, 0.2)',
    };
  }

  // Reset form inputs
  private resetForm(): void {
    this.newProductId = 0;
    this.newQuantity = 1;
    this.newCartId = 0;
    this.errorMessage = '';
  }


  setClientName() {
    const cart = this.cartItems.find(item => item.id === +this.newCartId); // Ensure comparison works
    if (cart) {
      this.ClientName = cart.client_name || ''; // Fallback to empty string if undefined
    }
  }

  // Set product name based on Product ID
  setProductName() {
    const product = this.productItems.find((item: Product) => item.id === this.newProductId); // Ensure correct typing
    if (product) {
      this.newProductName = product.name; // Correct assignment
    }
  }

}

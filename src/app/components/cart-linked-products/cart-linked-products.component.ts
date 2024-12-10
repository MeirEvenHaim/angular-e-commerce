import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart-linked-products.service';
import { CartLinkedProduct } from '../../models';


@Component({
  selector: 'app-cart-linked-products.component',
  templateUrl: './cart-linked-products.component.html',
  styleUrls: ['./cart-linked-products.component.css']
})
export class CartItemsComponent implements OnInit {
  cartItems: CartLinkedProduct[] = [];
  newProductId: number = 0;
  newQuantity: number = 1;
  newCartId: number = 0;
  errorMessage: string = '';
  constructor(private cartService: CartService) {}

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
      }
    });
  }

  // Add a new product to the cart
  addProduct(): void {
    if (this.newCartId && this.newProductId && this.newQuantity > 0) {
      // Call the service method to add the product
      this.cartService.addProductToCart(this.newCartId, this.newProductId, this.newQuantity).subscribe({
        next: (newItem) => {
          this.cartItems.push(newItem);
          this.resetForm();
          console.log("Product added successfully:", newItem);
        },
        error: (error) => {
          this.errorMessage = 'Error adding product to cart';
          console.error('Error adding product to cart:', error);
        }
      });
    } else {
      this.errorMessage = 'Please provide valid input values';
    }
  }


  updateQuantity(cartItem: any, newQuantity: number): void {
    const updatedItem = { ...cartItem, quantity: newQuantity }; // Update the quantity field

    this.cartService.updateCartItem(updatedItem).subscribe({
      next: (response) => {
        console.log('Updated Item:', response);

        // Update the item in the local cartItems array
        const index = this.cartItems.findIndex(item => item.id === cartItem.id);
        if (index !== -1) {
          this.cartItems[index] = response;
        }
      },
      error: (error) => {
        this.errorMessage = 'Error updating cart item';
        console.error('Error updating cart item:', error);
      }
    });
  }
  // Remove a cart item
  removeItem(cartItemId: number): void {
    this.cartService.removeProductFromCart(cartItemId).subscribe({
      next: () => {
        this.cartItems = this.cartItems.filter(item => item.id !== cartItemId);
      },
      error: (error) => {
        this.errorMessage = 'Error removing product from cart';
        console.error('Error removing product from cart:', error);
      }
    });
  }

  // Reset form inputs
  private resetForm(): void {
    this.newProductId = 0;
    this.newQuantity = 1;
    this.newCartId = 0;
    this.errorMessage = '';
  }
}

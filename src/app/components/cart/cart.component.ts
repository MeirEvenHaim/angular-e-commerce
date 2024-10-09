import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';  // Import Router for navigation
import { CartService, Cart } from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  carts: Cart[] = [];
  selectedCart: Cart | null = null;

  constructor(private cartService: CartService, private router: Router) { } // Inject Router

  ngOnInit(): void {
    this.fetchCarts();
  }

  fetchCarts(): void {
    this.cartService.getCarts().subscribe(
      (data: Cart[]) => {
        this.carts = data;
      },
      (error) => {
        console.error('Error fetching carts', error);
      }
    );
  }

  viewCart(id: number): void {
    this.cartService.getCart(id).subscribe(
      (data: Cart) => {
        this.selectedCart = data; 
      },
      (error) => {
        console.error('Error fetching cart', error);
      }
    );
  }

  createCart(): void {
    const newCart: Cart = {
      client: '1', // Set a default client ID or fetch dynamically
      products: [],
      created_at: new Date().toISOString()
    };
    this.cartService.createCart(newCart).subscribe(
      (data: Cart) => {
        this.carts.push(data);
      },
      (error) => {
        console.error('Error creating cart', error);
      }
    );
  }

  deleteCart(id: number): void {
    this.cartService.deleteCart(id).subscribe(
      () => {
        this.carts = this.carts.filter(cart => cart.id !== id);
      },
      (error) => {
        console.error('Error deleting cart', error);
      }
    );
  }

  // Method to navigate to the shop
  goToShop(): void {
    this.router.navigate(['/shop']); // Adjust the path according to your routing setup
  }
}

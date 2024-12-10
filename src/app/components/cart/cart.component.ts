import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; // Import Router for navigation
import { CartService } from '../../services/cart.service';
import { Cart } from '../../models';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  carts: Cart[] = [];
  selectedCart: Cart | null = null;
  userId: string | null = localStorage.getItem('user_id')



  constructor(private cartService: CartService, private router: Router) {} // Inject Router

  ngOnInit(): void {
    this.fetchCarts();
  }

  fetchCarts(): void {
    this.cartService.getCarts().subscribe(
      (data: Cart[]) => {
        console.log("data",data);

        this.carts = data;
      },
      (error) => {
        console.error('Error fetching carts', error);
      }
    );
  }

  viewCart(id: number): void {
    console.log("respons", id);

    this.cartService.getCart(id).subscribe(
      (data: Cart) => {
        this.selectedCart = data;
      },
      (error) => {
        console.error('Error fetching cart', error);
      }
    );
  }
  // Method to select a cart and navigate to the PaymentComponent
  // Navigate to the payment page with selected cart
  selectCartForPayment(cart: Cart): void {
    this.router.navigate(['/payment'], { state: { cart } });
  }

  createCart(id: string): void {
    const newCart: Cart = {
      user: +id, // Set a default client ID or fetch dynamically
    };
    console.log(newCart , "hee");

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
        this.carts = this.carts.filter((cart) => cart.id !== id);
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

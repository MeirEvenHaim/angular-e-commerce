import { CartService } from './../../services/cart.service';
import { Component, OnInit,ViewChild,TemplateRef } from '@angular/core';
import { Router } from '@angular/router'; // Import Router for navigation
import { Cart } from '../../models';
import { MatDialog } from '@angular/material/dialog';
import { ChangeDetectorRef } from '@angular/core';
@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  carts: Cart[] = [];
  selectedCart: Cart | null = null;
  userId: string | null = localStorage.getItem('user_id');
  @ViewChild('dialogTemplate') dialogTemplate!: TemplateRef<any>;

  constructor(
    private cartService: CartService,
     private router: Router ,
     private dialog : MatDialog,
     private cdr: ChangeDetectorRef) {} // Inject Router

  ngOnInit(): void {
    this.fetchCarts();
  }

  fetchCarts(): void {
    this.cartService.getCarts().subscribe(
      (data: Cart[]) => {
        console.log('data', data);

        this.carts = data;
      },
      (error) => {
        console.error('Error fetching carts', error);
      }
    );
  }

  viewCart(id: number): void {
    console.log('Fetching cart details for ID:', id);

    this.cartService.getCart(id).subscribe(
      (data) => {
        // Set selectedCart to the fetched data
        this.selectedCart = data;

        // Trigger change detection to ensure template updates
        this.cdr.detectChanges();

        // Open the dialog after data is ready
        if (this.dialogTemplate) {
          this.dialog.open(this.dialogTemplate, {
            data: this.selectedCart, // Pass the loaded data
          });
        }
      },
      (error) => {
        console.error('Error fetching cart', error);
      }
    );
  }
  selectCartForPayment(cart: Cart): void {
    this.router.navigate(['/payment'], { state: { cart } });
  }

  createCart(id: string): void {
    const newCart: Cart = {
      user: +id, // Set a default client ID or fetch dynamically
    };
    console.log(newCart, 'hee');

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
    this.router.navigate(['/product']); // Adjust the path according to your routing setup
  }
}

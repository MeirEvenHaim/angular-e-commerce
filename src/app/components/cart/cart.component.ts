import { CartService } from '../../services copy/profile_service/cart.service';
import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Router } from '@angular/router'; // Import Router for navigation
import { Cart } from '../../models file/CartModel';
import { MatDialog } from '@angular/material/dialog';
import { ChangeDetectorRef } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar'; // For success/error messages

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  buttonStyles: any = {};
  carts: Cart[] = [];
  dialogRef: any; // Variable to hold the reference to the dialog

  selectedCart: Cart | null = null;
  userId: string | null = localStorage.getItem('user_id');
  @ViewChild('dialogTemplate') dialogTemplate!: TemplateRef<any>;

  constructor(
    private snackBar: MatSnackBar,
    private cartService: CartService,
    private router: Router,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.fetchCarts();
  }

  fetchCarts(): void {
    this.cartService.getCarts();  // Fetch the list of carts
    this.cartService.carts$.subscribe(
      (data: Cart[]) => {
        console.log('Carts fetched:', data);
        this.carts = data;
      },
      (error: any) => {
        console.error('Error fetching carts', error);
      }
    );
  }

  viewCart(id: number): void {
    console.log('Fetching cart details for ID:', id);

    this.cartService.getCart(id).subscribe(
      (data) => {
        this.selectedCart = data;
        this.cdr.detectChanges(); // Trigger change detection

        this.dialogRef = this.dialog.open(this.dialogTemplate, {
          data: this.selectedCart, // Pass the loaded data to the dialog
        });
      },
      (error) => {
        console.error('Error fetching cart', error);
      }
    );
  }

  deleteCart(id: number): void {
    this.cartService.deleteCart(id).subscribe(
      () => {
        // Remove the deleted cart from the list
        this.carts = this.carts.filter((cart) => cart.id !== id);
        console.log('Deleted cart with ID:', id);

        // Close the dialog after successful deletion
        if (this.dialogRef) {
          this.dialogRef.close(); // Close the dialog
        }

        // Show success message
        this.showSuccessMessage('Cart deleted successfully!');
        this.fetchCarts();  // Fetch updated cart list
      },
      (error) => {
        console.error('Error deleting cart', error);
        this.showErrorMessage('Failed to delete cart.');
      }
    );
  }

  showSuccessMessage(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['success-snackbar'],
    });
  }

  showErrorMessage(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['error-snackbar'],
    });
  }

  selectCartForPayment(cart: Cart): void {
    // Navigate to the payment page and pass the cart as state
    console.log("cart:", cart);

    this.router.navigate(['/payment'], { state: { cart: cart } });
  }
  selectCartForShipping(cart: Cart): void {
    // Navigate to the shipping page and pass the cartId as query params
    this.router.navigate(['/shipping'],{ state: { cartId: cart.id } });
  }
  createCart(id: string): void {
    // Create a new cart with the given user ID
    const newCart: Cart = {
      user: +id, // Set the client ID (make sure the ID is valid)
    };
    console.log('Creating cart:', newCart);

    this.cartService.createCart(newCart).subscribe(
      (data: Cart) => {
        this.carts.push(data); // Add newly created cart to the list
        console.log('Cart created:', data);
        this.showSuccessMessage('Cart created successfully!');
        this.fetchCarts(); // Fetch updated carts list after creation
      },
      (error) => {
        this.showErrorMessage('Failed to create cart.');
        console.error('Error creating cart', error);
      }
    );
    this.fetchCarts()
  }

  goToShop(): void {
    this.router.navigate(['/product']); // Navigate to the shop page
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

}

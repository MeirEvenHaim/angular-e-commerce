import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { Cart } from '../../models';
import { ActivatedRoute } from '@angular/router'; // To access router state

declare const paypal: any; // Declare PayPal SDK global variable

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css'],
})
export class PaymentComponent implements OnInit {
  cart: Cart | null = null; // Store the cart model
  totalAmount: number = 0; // Store the dynamic amount for PayPal
  carts: Cart[] = []; // Store list of carts from the CartComponent

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    // Fetch all carts using the CartService (this is based on your fetchCarts() logic)
    this.fetchCarts();
  }

  // Fetch all carts (using the method you provided earlier)
  fetchCarts(): void {
    this.cartService.getCarts().subscribe(
      (data: Cart[]) => {
        console.log('Fetched carts', data);
        this.carts = data; // Store all the carts
        if (this.carts.length > 0) {
          // Select the first cart for now, or you can adjust based on your logic
          this.cart = this.carts[0];
          this.totalAmount = this.cart.total_price || 0; // Get total_price from the selected cart
          this.loadPayPalButton(); // Load PayPal button after cart is selected
        }
      },
      (error) => {
        console.error('Error fetching carts', error);
      }
    );
  }

  // Load the PayPal button dynamically with the fetched cart's total price
  loadPayPalButton(): void {
    if (!this.cart) return; // Ensure the cart is available

    paypal.Buttons({
      createOrder: (data: any, actions: any) => {
        return actions.order.create({
          purchase_units: [
            {
              amount: {
                value: this.totalAmount.toString(), // Use the dynamically fetched total_amount
              },
            },
          ],
        });
      },
      onApprove: (data: any, actions: any) => {
        return actions.order.capture().then((details: any) => {
          alert('Transaction completed by ' + details.payer.name.given_name);
          // You can call an API here to update the order status in your backend
        });
      },
      onError: (err: any) => {
        console.error('PayPal error:', err);
        alert('An error occurred during the transaction.');
      },
    }).render('#paypal-button-container');
  }
}

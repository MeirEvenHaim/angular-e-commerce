import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services copy/profile_service/cart.service';
import { Cart } from '../../models file/CartModel';
import { PaymentService } from '../../services copy/payment_service/payment.service';
import { Router } from '@angular/router'; // For navigation

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

  constructor(
    private cartService: CartService,
    private paymentService: PaymentService, // Inject the payment service
    private router: Router // Inject router for redirecting after payment
  ) {
    this.cart = this.router.getCurrentNavigation()?.extras.state!['cart'];
    console.log('HOHOHO', this.cart);
  }
  ngOnInit(): void {
    this.cartFunc();
  }
  cartFunc() {
    this.totalAmount = this.cart?.total_price || 0; // Get total_price dynamically from the selected cart
    this.loadPayPalButton(); // Load PayPal button after cart is selected
  }

  // Load the PayPal button dynamically with the fetched cart's total price
  loadPayPalButton(): void {
    if (!this.cart) return; // Ensure the cart is available

    paypal
      .Buttons({
        createOrder: (data: any, actions: any) => {
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  value: this.totalAmount.toString(), // Use dynamically fetched total_amount
                },
              },
            ],
          });
        },
        onApprove: (data: any, actions: any) => {
          return actions.order.capture().then((details: any) => {
            // Alert for successful transaction
            alert('Transaction completed by ' + details.payer.name.given_name);

            // Dynamically map payment data from the PayPal response
            const paymentData = {
              paypal_order_id: details.id, // PayPal Order ID
              capture_id:
                details.purchase_units[0].payments.captures[0]?.id || '',
              intent: details.intent,
              status: details.status,
              currency: details.purchase_units[0].amount.currency_code,
              amount: details.purchase_units[0].amount.value,
              payer_name: `${details.payer.name.given_name} ${details.payer.name.surname}`,
              payer_email: details.payer.email_address,
              payer_id: details.payer.payer_id,
              shipping_address: {
                address_line_1: details.payer.address?.address_line_1 || '',
                address_line_2: details.payer.address?.address_line_2 || '',
                admin_area_1: details.payer.address?.admin_area_1 || '',
                admin_area_2: details.payer.address?.admin_area_2 || '',
                postal_code: details.payer.address?.postal_code || '',
                country_code: details.payer.address?.country_code || '',
              },
              create_time: details.create_time,
              update_time: details.update_time,
            };

            // Log the payment data for debugging
            console.log('Constructed Payment Data:', paymentData);

            // Send the constructed payment data to the backend
            this.paymentService.capturePayment(paymentData).subscribe(
              (response) => {
                console.log('Payment successfully processed:', response);
                this.router.navigate(['/product']);
              },

              (error) => {
                if ( this.totalAmount <= 0) {
                  console.error('price cant be lower then or equal to 0:', error);
                  alert('price cant be lower then or equal to 0');
                }
                console.error('Payment error:', error);
                alert('Error sending payment data to the server.');
              }
            );
          });
        },
        onError: (err: any) => {
          console.error('PayPal error:', err);
          alert('An error occurred during the transaction.');
        },
      })
      .render('#paypal-button-container');
  }
}

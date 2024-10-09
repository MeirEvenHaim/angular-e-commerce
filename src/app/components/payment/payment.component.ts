import { Component, OnInit } from '@angular/core';
import { PaymentService } from '../../services/payment.service';

declare var paypal: any; // Declare the PayPal variable for integration

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  constructor(private paymentService: PaymentService) { }

  ngOnInit() {
    this.loadPaypalScript();
  }

  loadPaypalScript() {
    const script = document.createElement('script');
    script.src = 'https://www.paypal.com/sdk/js?client-id=AcTg13p-nTvInt70-aj_Kj-d-2CcyWUflaoP8hhKRnWYYAOUOsmgQiGHbLack1Ln912UtnCBneKiZJ4y';
    script.onload = () => this.initializePayPalButton();
    document.body.appendChild(script);
  }

  initializePayPalButton() {
    paypal.Buttons({
      createOrder: (data: { orderID: string }, actions: any) => {
        return this.paymentService.createPayment('YOUR_ORDER_ID').toPromise()
          .then((response: any) => response.id);  // Return payment ID
      },
      onApprove: (data: { orderID: string }, actions: any) => {
        return this.paymentService.paymentSuccess(data.orderID).toPromise()
          .then((response: any) => {
            console.log('Payment successful', response);
          });
      },
      onCancel: (data: any) => {
        console.log('Payment cancelled');
        this.paymentService.paymentCancelled().subscribe(); // Handle cancellation
      },
      onError: (err: any) => {
        console.error('Payment error', err);
      }
    }).render('#paypal-button-container'); // Render the PayPal button
  }
}

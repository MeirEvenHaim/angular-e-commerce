import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = 'http://127.0.0.1:8000/paypal/'; // Adjust the URL as necessary

  constructor(private http: HttpClient) { }

  // Create a payment
  createPayment(orderId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}create-payment/`, { order_id: orderId });
  }

  // Payment success
  paymentSuccess(paymentId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}payment_done/`, { payment_id: paymentId });
  }

  // Payment cancelled
  paymentCancelled(): Observable<any> {
    return this.http.post(`${this.apiUrl}payment_cancelled/`, {});
  }
}

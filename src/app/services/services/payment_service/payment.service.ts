import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private SERVER = 'http://127.0.0.1:8000/payments';

  constructor(private http: HttpClient) {}

  // Helper to create HTTP headers with accessToken
  private getHeaders(): HttpHeaders {
    const accessToken = localStorage.getItem('accessToken');  // Adjust as per your token storage method
    return new HttpHeaders({
      'Authorization': `Bearer ${accessToken}`,  // Authorization header with Bearer token
      'Content-Type': 'application/json'        // Set content type to JSON
    });
  }

  capturePayment(paymentData: any): Observable<any> {
    console.log(paymentData);
    return this.http.post(this.SERVER + '/create/', paymentData,{ headers: this.getHeaders() });
  }

  getPayment(paymentId: string): Observable<any> {
    return this.http.get(`${this.SERVER}/${paymentId}/`);
  }

  getAllPayments(): Observable<any> {
    return this.http.get(this.SERVER + '/');
  }
}

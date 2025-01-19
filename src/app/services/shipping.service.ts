import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Shipping } from '../models';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ShippingService {
  SERVER: string = "http://127.0.0.1:8000/shippings/";

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const accessToken = localStorage.getItem('accessToken');  // Adjust as per your token storage method
    return new HttpHeaders({
      'Authorization': `Bearer ${accessToken}`,  // Authorization header with Bearer token
      'Content-Type': 'application/json'         // Set content type to JSON
    });
  }

  // Fetch shipping details
  Detailed_Shipping_info(): Observable<Shipping[]> {
    return this.http.get<Shipping[]>(this.SERVER, { headers: this.getHeaders() });
  }

  // Create a new shipping schedule
  Creating_Shipping_Schedule(shipping: Shipping): Observable<Shipping> {
    const body = {
      id : shipping.id,
      cart_id: shipping.cart_id,   // Use the `id` of the `Cart` object, as it is a OneToOne relationship
      shipping_address: shipping.shipping_address,
      shipping_date: shipping.shipping_date,
      shipping_method: shipping.shipping_method,
      delivery_date: shipping.delivery_date
    };
    console.log("noughty body" , body);

    return this.http.post<Shipping>(this.SERVER, body, { headers: this.getHeaders() });
  }

  // Update shipping information
  Updating_shipping_info(id: number, shipping: Shipping): Observable<Shipping> {
    const body = {
      id : shipping.id,
      cart_id: shipping.cart_id,   // Use the `id` of the `Cart` object
      shipping_address: shipping.shipping_address,
      shipping_date: shipping.shipping_date,
      shipping_method: shipping.shipping_method,
      delivery_date: shipping.delivery_date
    };
    console.log("noughty body" , body);
    return this.http.put<Shipping>(`${this.SERVER}${id}/`, body, { headers: this.getHeaders() });
  }

  // Delete shipping information
  Deleting_Shipping_info(id: number): Observable<void> {
    return this.http.delete<void>(`${this.SERVER}${id}/`, { headers: this.getHeaders() });
  }
}

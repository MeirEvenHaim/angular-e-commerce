import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cart } from '../models';



@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = 'http://127.0.0.1:8000/carts/';


  constructor(private http: HttpClient) { }

  // Helper to create HTTP headers with accessToken
  private getHeaders(): HttpHeaders {
    const accessToken = localStorage.getItem('accessToken');  // Adjust as per your token storage method
    return new HttpHeaders({
      'Authorization': `Bearer ${accessToken}`,  // Authorization header with Bearer token
      'Content-Type': 'application/json'        // Set content type to JSON
    });
  }

  // Fetch all carts
  getCarts(): Observable<Cart[]> {
    return this.http.get<Cart[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  // Fetch a single cart by ID
  getCart(id: number): Observable<Cart> {
    return this.http.get<Cart>(`${this.apiUrl}${id}/`, { headers: this.getHeaders() });
  }

  // Create a new cart
  createCart(cart: Cart): Observable<Cart> {
    return this.http.post<Cart>(this.apiUrl, cart, { headers: this.getHeaders() });
  }

  // Update an existing cart
  updateCart(id: number, cart: Cart): Observable<Cart> {
    return this.http.put<Cart>(`${this.apiUrl}${id}/`, cart, { headers: this.getHeaders() });
  }

  // Delete a cart
  deleteCart(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}${id}/`, { headers: this.getHeaders() });
  }

}

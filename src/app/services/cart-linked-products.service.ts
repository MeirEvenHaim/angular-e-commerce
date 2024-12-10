import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CartLinkedProduct } from '../models';
import { log } from 'console';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = 'http://127.0.0.1:8000/cart_link_products'; // Base API URL

  constructor(private http: HttpClient) {}

  // Helper function to get authorization headers
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('accessToken');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : ''
    });
  }

  // Fetch all cart items
  getCartItems(): Observable<CartLinkedProduct[]> {
    return this.http
      .get<CartLinkedProduct[]>(`${this.apiUrl}/`, {
        headers: this.getAuthHeaders()
      })
      .pipe(
        catchError((error) => {
          console.error('Error fetching cart items', error);
          return throwError(error);
        })
      );
  }

  addProductToCart(cartId: number, productId: number, quantity: number): Observable<CartLinkedProduct> {
    // Stringify the values in the service method
    const body = {
      cart: cartId.toString(),    // Convert cartId to string
      product: productId.toString(),  // Convert productId to string
      quantity: quantity.toString()  // Convert quantity to string
    };
    console.log('Sending request with body:', body);  // Debugging log to check the body

    return this.http
      .post<CartLinkedProduct>(`${this.apiUrl}/`, body, {
        headers: this.getAuthHeaders()
      })
      .pipe(
        catchError((error) => {
          console.error('Error adding product to cart', error);
          return throwError(error);
        })
      );
  }

  updateCartItem(cartItem: any): Observable<CartLinkedProduct> {
    const { id, cart, product, quantity } = cartItem;
    const body = { cart, product, quantity }; // Match the payload structure
    console.log('PUT Request Payload:', body);

    return this.http.put<CartLinkedProduct>(`${this.apiUrl}/${id}/`, body, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError((error) => {
        console.error('PUT Request Error:', error);
        return throwError(error);
      })
    );
  }
  // Remove a specific product from the cart
  removeProductFromCart(cartItemId: number): Observable<void> {
    return this.http
      .delete<void>(`${this.apiUrl}/${cartItemId}/`, {
        headers: this.getAuthHeaders()
      })
      .pipe(
        catchError((error) => {
          console.error('Error removing product from cart', error);
          return throwError(error);
        })
      );
  }
}

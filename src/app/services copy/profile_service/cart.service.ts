import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Cart } from '../../models file/CartModel';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private apiUrl = 'http://127.0.0.1:8000/carts/';
  private cartsSubject = new BehaviorSubject<Cart[]>([]);  // Holds the current carts state
  carts$ = this.cartsSubject.asObservable();  // Observable to subscribe to in components

  constructor(private http: HttpClient) {}

  // Helper to create HTTP headers with accessToken
  private getHeaders(): HttpHeaders {
    const accessToken = localStorage.getItem('accessToken');  // Adjust as per your token storage method
    return new HttpHeaders({
      'Authorization': `Bearer ${accessToken}`,  // Authorization header with Bearer token
      'Content-Type': 'application/json'        // Set content type to JSON
    });
  }

  // Fetch all carts and update the BehaviorSubject with fresh data
  getCarts(): Observable<Cart[]> {
    this.http.get<Cart[]>(this.apiUrl, { headers: this.getHeaders() }).subscribe(
      (data) => {
        this.cartsSubject.next(data);  // Update the current state with fresh data
      },
      (error) => {
        console.error('Error fetching carts', error);
      }
    );
    return this.cartsSubject.asObservable();  // Return the observable to the component
  }

  // Fetch a single cart by ID
  getCart(id: number): Observable<Cart> {
    return this.http.get<Cart>(`${this.apiUrl}${id}/`, { headers: this.getHeaders() });
  }

  // Create a new cart, then fetch the updated list of carts
  createCart(cart: Cart): Observable<Cart> {
    return this.http.post<Cart>(this.apiUrl, cart, { headers: this.getHeaders() }).pipe(
      switchMap(() => {
        this.getCarts();  // Re-fetch carts after creation
        return [];  // Return nothing, just trigger the update
      })
    );
  }

  // Update an existing cart, then fetch the updated list of carts
  updateCart(id: number, cart: Cart): Observable<Cart> {
    return this.http.put<Cart>(`${this.apiUrl}${id}/`, cart, { headers: this.getHeaders() }).pipe(
      switchMap(() => {
        this.getCarts();  // Re-fetch carts after update
        return [];  // Return nothing, just trigger the update
      })
    );
  }

  // Delete a cart, then fetch the updated list of carts
  deleteCart(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}${id}/`, { headers: this.getHeaders() }).pipe(
      switchMap(() => {
        this.getCarts();  // Re-fetch carts after deletion
        return [];  // Return nothing, just trigger the update
      })
    );
  }

  // Lock a cart and then refresh the list
  lockCart(id: number): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}${id}/lock/`, { locked: true }, { headers: this.getHeaders() }).pipe(
      switchMap(() => {
        this.getCarts();  // Re-fetch carts after locking
        return [];  // Return nothing, just trigger the update
      })
    );
  }
}

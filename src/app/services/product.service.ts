import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://127.0.0.1:8000/products/'; // Replace with your API URL

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('accessToken'); // Adjust the token retrieval based on your auth implementation
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  createProduct(product: Product): Observable<Product> {
    const formattedProduct = {
      ...product,
      price: product.price.toString() // Ensure price is sent as string
    };
    return this.http.post<Product>(this.apiUrl, formattedProduct, { headers: this.getHeaders() });
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}${id}/`, { headers: this.getHeaders() });
  }

  updateProduct(id: number, product: Product): Observable<Product> {
    const formattedProduct = {
      ...product,
      price: product.price.toString() // Ensure price is sent as string
    };
    return this.http.put<Product>(`${this.apiUrl}${id}/`, formattedProduct, { headers: this.getHeaders() });
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}/`, { headers: this.getHeaders() });
  }
}

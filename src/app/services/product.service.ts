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
      // No Content-Type header for multipart/form-data
    });
  }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl, { headers: this.getHeaders() });
  }


  createProduct(product: Product, file: File | null): Observable<Product> {
    const formData: FormData = new FormData();

    // Append product fields to the FormData object
    formData.append('name', product.name || '');
    formData.append('description', product.description || '');
    formData.append('price', product.price.toString());
    formData.append('stock', product.stock.toString());

    // Append supplier and category to the FormData object
    if (product.supplier_id !== null) {
      formData.append('supplier_id', product.supplier_id.toString());
    }
    if (product.category_id !== null) {
      formData.append('category_id', product.category_id.toString());
    }

    // Append the file if it exists
    if (file) {
      formData.append('image', file, file.name);
    }

    console.log('Form data before sending:', formData);

    return this.http.post<Product>(this.apiUrl, formData, { headers: this.getHeaders() });
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}${id}/`, { headers: this.getHeaders() });
  }

  updateProduct(id: number, product: Product, file: File | null): Observable<Product> {
    const formData: FormData = new FormData();

    // Append product fields to FormData
    formData.append('name', product.name || '');
    formData.append('description', product.description || '');
    formData.append('price', product.price.toString());
    formData.append('stock', product.stock.toString());

    // Append supplier and category to FormData, converting to strings if not null
    if (product.supplier_id !== null) {
      formData.append('supplier_id', product.supplier_id.toString());
    }
    if (product.category_id !== null) {
      formData.append('category_id', product.category_id.toString());
    }

    // Append the file if it exists
    if (file) {
      formData.append('image', file, file.name);
    }

    // Sending FormData to the backend
    return this.http.put<Product>(`${this.apiUrl}${id}/`, formData, {
      headers: this.getHeaders()
    });
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}/`, { headers: this.getHeaders() });
  }
}

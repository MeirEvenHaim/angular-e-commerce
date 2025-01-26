import { Suppliers } from '../../models file/supplierModel';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class SuppliersService {
    private SERVER = 'http://127.0.0.1:8000/suppliers/';
    constructor(private http: HttpClient) {}

    private getHeaders(): HttpHeaders {
      const accessToken = localStorage.getItem('accessToken'); // Adjust as per your token storage method
      return new HttpHeaders({
        Authorization: `Bearer ${accessToken}`, // Authorization header with Bearer token
        'Content-Type': 'application/json', // Set content type to JSON
      });
    }

    SuppliersMenu(): Observable<Suppliers[]> {
      return this.http.get<Suppliers[]>(this.SERVER, {
        headers: this.getHeaders(),
      });
    }

    // Fetch a specific category by ID
    GetSupplierById(id: number): Observable<Suppliers[]> {
      return this.http.get<Suppliers[]>(`${this.SERVER}${id}/`, {
        headers: this.getHeaders(),
      });
    }

    createSupplier(supplier: Suppliers): Observable<Suppliers[]> {
      // Create the body to be sent as JSON
      const body = {
        name: supplier.name,
        contact_email: supplier.contact_email || '',
        phone_number:supplier.phone_number,
        address : supplier.address   // Ensure description is either a string or empty string
      };

      // Send the request with the JSON body and set the correct content type header
      return this.http.post<Suppliers[]>(`${this.SERVER}`, body,{ headers: this.getHeaders()}
  );
    }

    // Update an existing category
    UpdateSupplier(id: number, supplier: Suppliers): Observable<Suppliers[]> {
      // Create the body to be sent as JSON
      const body = {
        name: supplier.name,
        contact_email: supplier.contact_email || '',
        phone_number:supplier.phone_number,
        address : supplier.address   // Ensure description is either a string or empty string
      };
      console.log(body);

      return this.http.put<Suppliers[]>(`${this.SERVER}${id}/`, body, {
        headers: this.getHeaders(),
      });
    }


      // Delete a category
      Deletesupplier(id: number): Observable<void> {
        return this.http.delete<void>(`${this.SERVER}${id}/`,{
          headers: this.getHeaders()})
      }
  }


import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Categories } from '../models';
@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  private SERVER = 'http://127.0.0.1:8000/categories/';
  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const accessToken = localStorage.getItem('accessToken'); // Adjust as per your token storage method
    return new HttpHeaders({
      Authorization: `Bearer ${accessToken}`, // Authorization header with Bearer token
      'Content-Type': 'application/json', // Set content type to JSON
    });
  }

  CategoriesMenu(): Observable<Categories[]> {
    return this.http.get<Categories[]>(this.SERVER, {
      headers: this.getHeaders(),
    });
  }

  // Fetch a specific category by ID
  getCategoryById(id: number): Observable<Categories> {
    return this.http.get<Categories>(`${this.SERVER}${id}/`, {
      headers: this.getHeaders(),
    });
  }

  createCategory(category: Categories): Observable<Categories> {
    // Create the body to be sent as JSON
    const body = {
      name: category.name,
      description: category.description || '',  // Ensure description is either a string or empty string
    };

    // Send the request with the JSON body and set the correct content type header
    return this.http.post<Categories>(`${this.SERVER}`, body,{ headers: this.getHeaders()}
);
  }

  // Update an existing category
  updateCategory(id: number, category: Categories): Observable<Categories> {
    // Create the body to be sent as JSON
    const body = {
      name: category.name,
      description: category.description || '',  // Ensure description is either a string or empty string
    };
    console.log(body);

    return this.http.put<Categories>(`${this.SERVER}${id}/`, body, {
      headers: this.getHeaders(),
    });
  }


    // Delete a category
    deleteCategory(id: number): Observable<void> {
      return this.http.delete<void>(`${this.SERVER}${id}/`,{
        headers: this.getHeaders()})
    }
}

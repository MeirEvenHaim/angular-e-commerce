import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://127.0.0.1:8000'; 
  private user: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  // Login method
  login(username: string, password: string): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrl}/login/`, { username, password })
      .pipe(
        catchError((error) => {
          console.error('Login failed', error);
          return throwError(error);
        })
      );
  }

  // Save user role and token to local storage
  saveToken(
    token: string,
    isStaff: boolean,
    isSuperuser: boolean,
    user_id: Number
  ): void {
    localStorage.setItem('accessToken', token);
    localStorage.setItem('is_staff', JSON.stringify(isStaff)); // Save staff status
    localStorage.setItem('is_superuser', JSON.stringify(isSuperuser)); // Save superuser status
    localStorage.setItem('user_id', JSON.stringify(user_id));
  }

  // Get token from local storage
  getToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  // Get user role (staff status) from local storage
  isUserStaff(): boolean {
    const isStaff = localStorage.getItem('is_staff');
    return isStaff === 'true'; // Convert string to boolean
  }

  // Get superuser role from local storage
  isUserSuperuser(): boolean {
    const isSuperuser = localStorage.getItem('is_superuser');
    return isSuperuser === 'true'; // Convert string to boolean
  }

  // Remove token and user role from local storage
  removeToken(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('is_staff');
    localStorage.removeItem('is_superuser');
    console.log('Token and role removed from local storage'); // Debugging log
  }

  // Check if the user is logged in
  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }

  // Add the Authorization header to the request
  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      Authorization: token ? `Bearer ${token}` : '',
    });
  }

  // Example of making an authenticated request
  getProtectedData(): Observable<any> {
    return this.http
      .get<any>(`${this.apiUrl}/protected-route`, {
        headers: this.getAuthHeaders(),
      })
      .pipe(
        catchError((error) => {
          console.error('Error fetching protected data', error);
          return throwError(error);
        })
      );
  }

  // Logout method
  logout(): void {
    this.removeToken();
    this.router.navigate(['/login']); // Redirect to login page
  }
}
